import 'server-only'
import { sql } from 'drizzle-orm'
import type { StudentDashboard } from '@/types/lms'
import { date, num, rawRows, str } from '../db/raw'
import { certificateCodesByCourse } from './certificates'
import { listStudentCourses } from './learning'

const TIME_ZONE = 'America/Sao_Paulo'

// Última atividade em cada curso: aula concluída, evento de uso ou a própria matrícula
async function lastActivityByCourse(profileId: string) {
  const rows = await rawRows(sql`
    select en.course_id, greatest(en.created_at,
      (select max(lp.completed_at) from lesson_progress lp
        join lessons l on l.id = lp.lesson_id join course_modules m on m.id = l.module_id
        where lp.profile_id = en.profile_id and m.course_id = en.course_id),
      (select max(a.created_at) from analytics_events a
        where a.profile_id = en.profile_id and a.course_id = en.course_id)) as last_activity
    from enrollments en where en.profile_id = ${profileId}`)
  return new Map(rows.map((row) => [num(row.course_id), date(row.last_activity)]))
}

async function positions(profileId: string, lessonIds: number[]) {
  if (!lessonIds.length) return new Map<number, number>()
  const rows = await rawRows(sql`
    select lesson_id, seconds from lesson_positions
    where profile_id = ${profileId} and lesson_id in (${sql.join(lessonIds, sql`, `)})`)
  return new Map(rows.map((row) => [num(row.lesson_id), num(row.seconds)]))
}

async function week(profileId: string) {
  const rows = await rawRows(sql`
    with done as (
      select (completed_at at time zone ${TIME_ZONE})::date as day, count(*) as total
      from lesson_progress
      where profile_id = ${profileId} and completed_at >= now() - interval '8 days'
      group by 1
    )
    select to_char(d.day, 'YYYY-MM-DD') as day, coalesce(done.total, 0) as total
    from generate_series((now() at time zone ${TIME_ZONE})::date - 6, (now() at time zone ${TIME_ZONE})::date,
      interval '1 day') as d(day)
    left join done on done.day = d.day::date
    order by d.day`)
  return rows.map((row) => ({ day: str(row.day), count: num(row.total) }))
}

async function recent(profileId: string) {
  const rows = await rawRows(sql`
    select l.id as lesson_id, l.title as lesson_title, c.title as course_title, c.slug, lp.completed_at
    from lesson_progress lp
    join lessons l on l.id = lp.lesson_id
    join course_modules m on m.id = l.module_id
    join courses c on c.id = m.course_id
    where lp.profile_id = ${profileId}
    order by lp.completed_at desc limit 5`)
  return rows.map((row) => ({
    lessonTitle: str(row.lesson_title),
    courseTitle: str(row.course_title),
    href: `/aluno/cursos/${str(row.slug)}/aulas/${num(row.lesson_id)}`,
    completedAt: date(row.completed_at) ?? new Date(),
  }))
}

async function watchedMinutes(profileId: string) {
  const [row = {}] = await rawRows(sql`
    select coalesce(sum(seconds), 0) as seconds from analytics_events
    where profile_id = ${profileId} and type = 'video_watch'`)
  return Math.round(num(row.seconds) / 60)
}

// Tudo o que a página inicial da área do aluno mostra
export async function getStudentDashboard(profileId: string): Promise<StudentDashboard> {
  const base = await listStudentCourses(profileId)
  const nextIds = base.map((course) => course.nextLessonId).filter((id): id is number => id !== null)
  const [activity, certificates, resume, weekData, recentData, minutes] = await Promise.all([
    lastActivityByCourse(profileId),
    certificateCodesByCourse(profileId),
    positions(profileId, nextIds),
    week(profileId),
    recent(profileId),
    watchedMinutes(profileId),
  ])

  const courses = base
    .map((course) => ({
      ...course,
      lastActivityAt: activity.get(course.id) ?? null,
      certificateCode: certificates.get(course.id) ?? null,
      resumeAt: course.nextLessonId ? (resume.get(course.nextLessonId) ?? 0) : 0,
    }))
    .sort((a, b) => (b.lastActivityAt?.getTime() ?? 0) - (a.lastActivityAt?.getTime() ?? 0))

  const unfinished = courses.filter((course) => course.completedCount < course.lessonCount)
  return {
    courses,
    current: unfinished[0] ?? courses[0] ?? null,
    stats: {
      inProgress: unfinished.length,
      lessonsDone: courses.reduce((total, course) => total + course.completedCount, 0),
      watchedMinutes: minutes,
      certificates: certificates.size,
    },
    week: weekData,
    recent: recentData,
  }
}
