import 'server-only'
import { sql } from 'drizzle-orm'
import type { CourseReport, CourseReportStudent, LessonFunnelItem } from '@/types/course-report'
import { date, num, rawRows, str } from '../db/raw'

// Alunos matriculados no curso com o progresso de cada um (usado na tabela e no CSV)
export async function listCourseStudents(courseId: number): Promise<CourseReportStudent[]> {
  const rows = await rawRows(sql`
    with course_lessons as (
      select l.id from lessons l join course_modules m on m.id = l.module_id where m.course_id = ${courseId}
    )
    select p.name, p.email, en.created_at as enrolled_at,
      (select count(*) from lesson_progress lp where lp.profile_id = p.id and lp.lesson_id in (select id from course_lessons)) as completed,
      (select count(*) from course_lessons) as total,
      greatest(en.created_at,
        (select max(lp.completed_at) from lesson_progress lp where lp.profile_id = p.id and lp.lesson_id in (select id from course_lessons)),
        (select max(a.created_at) from analytics_events a where a.profile_id = p.id and a.course_id = ${courseId})) as last_activity,
      (select c.code from certificates c where c.profile_id = p.id and c.course_id = ${courseId}) as certificate_code
    from enrollments en join profiles p on p.id = en.profile_id
    where en.course_id = ${courseId}
    order by last_activity desc nulls last`)
  return rows.map((row) => ({
    name: str(row.name),
    email: str(row.email),
    enrolledAt: date(row.enrolled_at),
    completed: num(row.completed),
    total: num(row.total),
    lastActivity: date(row.last_activity),
    certificateCode: row.certificate_code ? str(row.certificate_code) : null,
  }))
}

async function funnel(courseId: number, enrolled: number): Promise<LessonFunnelItem[]> {
  const rows = await rawRows(sql`
    select l.id, l.title, m.title as module_title,
      (select count(*) from lesson_progress lp
        join enrollments en on en.profile_id = lp.profile_id and en.course_id = ${courseId}
        where lp.lesson_id = l.id) as completed
    from lessons l join course_modules m on m.id = l.module_id
    where m.course_id = ${courseId}
    order by m.sort_order, l.sort_order`)
  let previous = 100
  return rows.map((row) => {
    const completed = num(row.completed)
    const percent = enrolled ? Math.round((completed / enrolled) * 100) : 0
    const item = {
      lessonId: num(row.id),
      title: str(row.title),
      moduleTitle: str(row.module_title),
      completed,
      percent,
      drop: Math.max(0, previous - percent),
    }
    previous = percent
    return item
  })
}

async function quizzes(courseId: number) {
  const rows = await rawRows(sql`
    select m.title as module_title,
      count(distinct qa.profile_id) as students,
      count(qa.id) as attempts,
      count(distinct qa.profile_id) filter (where qa.passed) as passed,
      coalesce(avg(qa.score * 100.0 / nullif(qa.total, 0)), 0) as average_percent
    from quizzes q
    join course_modules m on m.id = q.module_id
    left join quiz_attempts qa on qa.quiz_id = q.id
    where m.course_id = ${courseId}
    group by m.id, m.title, m.sort_order
    order by m.sort_order`)
  return rows.map((row) => ({
    moduleTitle: str(row.module_title),
    students: num(row.students),
    attempts: num(row.attempts),
    passed: num(row.passed),
    averagePercent: Math.round(num(row.average_percent)),
  }))
}

// Relatório de um curso: matrículas, conclusão, onde os alunos param e como vão nos quizzes
export async function getCourseReport(courseId: number): Promise<CourseReport> {
  const [students, [summary]] = await Promise.all([
    listCourseStudents(courseId),
    rawRows(sql`
      select
        (select count(*) from enrollments where course_id = ${courseId} and created_at >= now() - interval '30 days') as recent,
        (select count(*) from certificates where course_id = ${courseId}) as certificates,
        (select coalesce(avg(rating), 0) from course_reviews where course_id = ${courseId}) as rating,
        (select count(*) from course_reviews where course_id = ${courseId}) as reviews`),
  ])
  const enrolled = students.length
  const progress = students.map((student) => (student.total ? student.completed / student.total : 0))
  const [lessonFunnel, quizReport] = await Promise.all([funnel(courseId, enrolled), quizzes(courseId)])
  return {
    enrolled,
    enrolledLast30: num(summary?.recent),
    finished: students.filter((student) => student.total > 0 && student.completed >= student.total).length,
    certificates: num(summary?.certificates),
    averageProgress: enrolled ? Math.round((progress.reduce((sum, value) => sum + value, 0) / enrolled) * 100) : 0,
    rating: { average: num(summary?.rating), count: num(summary?.reviews) },
    funnel: lessonFunnel,
    quizzes: quizReport,
    students,
  }
}
