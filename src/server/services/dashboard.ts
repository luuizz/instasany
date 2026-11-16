import 'server-only'
import { count, desc, eq, gte, sql } from 'drizzle-orm'
import { db } from '../db/client'
import { num, rawRows, str } from '../db/raw'
import { courses, enrollments, lessonProgress, lessons, profiles } from '../db/schema'

export type DashboardStats = {
  publishedCourses: number
  draftCourses: number
  lessons: number
  students: number
  enrollments: number
  enrollmentsLastWeek: number
  completedLessons: number
}

export type RecentEnrollment = { studentName: string; studentEmail: string; courseTitle: string; createdAt: Date }

const total = async (query: Promise<{ value: number }[]>) => Number((await query)[0]?.value ?? 0)

// Números da visão geral do painel
export async function getDashboardStats(): Promise<DashboardStats> {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const [published, drafts, lessonCount, students, enrollmentCount, lastWeek, completed] = await Promise.all([
    total(db().select({ value: count() }).from(courses).where(eq(courses.published, true))),
    total(db().select({ value: count() }).from(courses).where(eq(courses.published, false))),
    total(db().select({ value: count() }).from(lessons)),
    total(db().select({ value: count() }).from(profiles).where(eq(profiles.role, 'student'))),
    total(db().select({ value: count() }).from(enrollments)),
    total(db().select({ value: count() }).from(enrollments).where(gte(enrollments.createdAt, weekAgo))),
    total(db().select({ value: count() }).from(lessonProgress)),
  ])
  return {
    publishedCourses: published,
    draftCourses: drafts,
    lessons: lessonCount,
    students,
    enrollments: enrollmentCount,
    enrollmentsLastWeek: lastWeek,
    completedLessons: completed,
  }
}

export async function listRecentEnrollments(limit = 6): Promise<RecentEnrollment[]> {
  const rows = await db()
    .select({
      studentName: sql<string>`coalesce(nullif(${profiles.name}, ''), ${profiles.email})`,
      studentEmail: profiles.email,
      courseTitle: courses.title,
      createdAt: enrollments.createdAt,
    })
    .from(enrollments)
    .innerJoin(profiles, eq(profiles.id, enrollments.profileId))
    .innerJoin(courses, eq(courses.id, enrollments.courseId))
    .orderBy(desc(enrollments.createdAt))
    .limit(limit)
  return rows
}

const TIME_ZONE = 'America/Sao_Paulo'

export type DashboardAttention = { unansweredQuestions: number; idleStudents: number; draftCourses: number }

// O que pede ação: dúvidas sem resposta da equipe e alunos parados há uma semana com curso em andamento
export async function getAttention(): Promise<DashboardAttention> {
  const [row] = await rawRows(sql`
    select
      (select count(*) from lesson_questions q join profiles a on a.id = q.profile_id
        where q.parent_id is null and a.role = 'student'
          and not exists (select 1 from lesson_questions r join profiles s on s.id = r.profile_id
            where r.parent_id = q.id and s.role <> 'student')) as unanswered,
      (select count(distinct en.profile_id) from enrollments en
        where (select count(*) from lesson_progress lp join lessons l on l.id = lp.lesson_id
                 join course_modules m on m.id = l.module_id
                 where lp.profile_id = en.profile_id and m.course_id = en.course_id)
              < (select count(*) from lessons l join course_modules m on m.id = l.module_id where m.course_id = en.course_id)
          and greatest(en.created_at,
                (select max(lp.completed_at) from lesson_progress lp where lp.profile_id = en.profile_id),
                (select max(a.created_at) from analytics_events a where a.profile_id = en.profile_id))
              < now() - interval '7 days') as idle,
      (select count(*) from courses where published = false) as drafts`)
  return { unansweredQuestions: num(row?.unanswered), idleStudents: num(row?.idle), draftCourses: num(row?.drafts) }
}

// Aulas concluídas por dia nos últimos 14 dias (fuso de São Paulo)
export async function dailyCompletions(days = 14) {
  const rows = await rawRows(sql`
    with done as (
      select (completed_at at time zone ${TIME_ZONE})::date as day, count(*) as total
      from lesson_progress where completed_at >= now() - make_interval(days => ${days + 1}) group by 1
    )
    select to_char(d.day, 'YYYY-MM-DD') as day, coalesce(done.total, 0) as total
    from generate_series((now() at time zone ${TIME_ZONE})::date - ${days - 1}::integer, (now() at time zone ${TIME_ZONE})::date,
      interval '1 day') as d(day)
    left join done on done.day = d.day::date
    order by d.day`)
  return rows.map((row) => ({ day: str(row.day), value: num(row.total) }))
}

export type CourseHealth = { id: number; title: string; published: boolean; enrolled: number; finished: number }

// Cada curso com matriculados e quantos terminaram todas as aulas
export async function listCourseHealth(): Promise<CourseHealth[]> {
  const rows = await rawRows(sql`
    select c.id, c.title, c.published,
      (select count(*) from enrollments en where en.course_id = c.id) as enrolled,
      (select count(*) from enrollments en
        where en.course_id = c.id
          and exists (select 1 from course_modules m join lessons l on l.module_id = m.id where m.course_id = c.id)
          and not exists (select 1 from course_modules m join lessons l on l.module_id = m.id
            where m.course_id = c.id
              and not exists (select 1 from lesson_progress lp where lp.lesson_id = l.id and lp.profile_id = en.profile_id))
      ) as finished
    from courses c order by c.published desc, enrolled desc, c.title`)
  return rows.map((row) => ({
    id: num(row.id),
    title: str(row.title),
    published: row.published === true || row.published === 't',
    enrolled: num(row.enrolled),
    finished: num(row.finished),
  }))
}
