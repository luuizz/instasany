import 'server-only'
import { eq, sql } from 'drizzle-orm'
import type { Role, RoleFilter, StudentCourseProgress, StudentDetail, StudentList } from '@/types/students'
import { db } from '../db/client'
import { date, num, rawRows, str, type RawRow } from '../db/raw'
import { profiles } from '../db/schema'

export const STUDENTS_PAGE_SIZE = 25

const toRole = (value: unknown): Role => (value === 'admin' || value === 'instructor' ? value : 'student')

// Última coisa que a pessoa fez: evento de uso, aula concluída ou matrícula
const lastActivity = sql`greatest(
  (select max(a.created_at) from analytics_events a where a.profile_id = p.id),
  (select max(lp.completed_at) from lesson_progress lp where lp.profile_id = p.id),
  (select max(en.created_at) from enrollments en where en.profile_id = p.id))`

const baseColumns = (row: RawRow) => ({
  id: str(row.id),
  name: str(row.name),
  email: str(row.email),
  role: toRole(row.role),
  createdAt: date(row.created_at),
  lastActivity: date(row.last_activity),
})

type ListFilters = { query: string; role: RoleFilter; page: number }

// Pessoas cadastradas com cursos, progresso nas aulas dos cursos em que estão e última atividade
export async function listStudents({ query, role, page }: ListFilters): Promise<StudentList> {
  const term = `%${query.trim()}%`
  const where = sql`(p.name ilike ${term} or p.email ilike ${term})
    and (${role} = 'all' or p.role::text = ${role})`
  const offset = (page - 1) * STUDENTS_PAGE_SIZE

  const [rows, [count = {}]] = await Promise.all([
    rawRows(sql`
      select p.id, p.name, p.email, p.role, p.created_at, ${lastActivity} as last_activity,
        (select count(*) from enrollments en where en.profile_id = p.id) as courses,
        (select count(*) from lesson_progress lp
          join lessons l on l.id = lp.lesson_id
          join course_modules m on m.id = l.module_id
          join enrollments en on en.course_id = m.course_id and en.profile_id = p.id
          where lp.profile_id = p.id) as completed,
        (select count(*) from lessons l
          join course_modules m on m.id = l.module_id
          join enrollments en on en.course_id = m.course_id
          where en.profile_id = p.id) as total
      from profiles p
      where ${where}
      order by last_activity desc nulls last, p.created_at desc
      limit ${STUDENTS_PAGE_SIZE} offset ${offset}`),
    rawRows(sql`select count(*) as total from profiles p where ${where}`),
  ])

  return {
    items: rows.map((row) => ({
      ...baseColumns(row),
      courses: num(row.courses),
      completedLessons: num(row.completed),
      totalLessons: num(row.total),
    })),
    total: num(count.total),
    page,
    pageSize: STUDENTS_PAGE_SIZE,
  }
}

async function courseProgress(profileId: string): Promise<StudentCourseProgress[]> {
  const rows = await rawRows(sql`
    select c.id, c.slug, c.title, en.created_at as enrolled_at,
      (select count(*) from lessons l join course_modules m on m.id = l.module_id where m.course_id = c.id) as total,
      (select count(*) from lesson_progress lp
        join lessons l on l.id = lp.lesson_id
        join course_modules m on m.id = l.module_id
        where m.course_id = c.id and lp.profile_id = en.profile_id) as completed,
      (select max(lp.completed_at) from lesson_progress lp
        join lessons l on l.id = lp.lesson_id
        join course_modules m on m.id = l.module_id
        where m.course_id = c.id and lp.profile_id = en.profile_id) as last_completed,
      (select ce.code from certificates ce where ce.course_id = c.id and ce.profile_id = en.profile_id) as certificate
    from enrollments en join courses c on c.id = en.course_id
    where en.profile_id = ${profileId}
    order by en.created_at desc`)
  return rows.map((row) => ({
    id: num(row.id),
    slug: str(row.slug),
    title: str(row.title),
    enrolledAt: date(row.enrolled_at),
    completed: num(row.completed),
    total: num(row.total),
    lastCompletedAt: date(row.last_completed),
    certificateCode: row.certificate ? str(row.certificate) : null,
  }))
}

async function activity(profileId: string) {
  // video_watch é enviado em blocos de tempo; fica de fora da linha do tempo
  const rows = await rawRows(sql`
    select a.type, a.path, a.created_at, l.title as lesson_title, c.title as course_title
    from analytics_events a
    left join lessons l on l.id = a.lesson_id
    left join courses c on c.id = a.course_id
    where a.profile_id = ${profileId} and a.type <> 'video_watch'
    order by a.created_at desc limit 15`)
  return rows.map((row) => ({
    type: str(row.type),
    path: str(row.path),
    lessonTitle: str(row.lesson_title),
    courseTitle: str(row.course_title),
    createdAt: date(row.created_at),
  }))
}

export async function getStudent(id: string): Promise<StudentDetail | null> {
  const [row] = await rawRows(sql`
    select p.id, p.name, p.email, p.role, p.created_at, ${lastActivity} as last_activity,
      (select coalesce(sum(a.seconds), 0) from analytics_events a
        where a.profile_id = p.id and a.type = 'video_watch') as watched,
      (select count(*) from analytics_events a where a.profile_id = p.id and a.type = 'page_view') as page_views
    from profiles p where p.id = ${id}`)
  if (!row) return null
  const [courses, recent] = await Promise.all([courseProgress(id), activity(id)])
  return {
    ...baseColumns(row),
    watchedMinutes: Math.round(num(row.watched) / 60),
    pageViews: num(row.page_views),
    courses,
    activity: recent,
  }
}

export class OwnRoleError extends Error {}

// Troca o papel; quem está logado não tira o próprio acesso de admin
export async function setRole(actorId: string, profileId: string, role: Role) {
  if (actorId === profileId) throw new OwnRoleError('Você não pode mudar o seu próprio papel.')
  const updated = await db()
    .update(profiles)
    .set({ role, updatedAt: new Date() })
    .where(eq(profiles.id, profileId))
    .returning({ id: profiles.id })
  return updated.length > 0
}
