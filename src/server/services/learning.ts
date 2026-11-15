import 'server-only'
import { and, eq, inArray } from 'drizzle-orm'
import type { CourseOutline, Lesson, LessonAttachment, LessonItem, StudentCourse } from '@/types/lms'
import { db } from '../db/client'
import { courses, enrollments, lessonPositions, lessonProgress } from '../db/schema'
import { listAttachments } from './attachments'
import { getLesson } from './course-admin'
import { getCourseBySlug, listAllCourses } from './courses'

export class NotPublishedError extends Error {}

const allLessons = (course: CourseOutline) => course.modules.flatMap((module) => module.lessons)

export async function isEnrolled(profileId: string, courseId: number) {
  const [row] = await db()
    .select({ courseId: enrollments.courseId })
    .from(enrollments)
    .where(and(eq(enrollments.profileId, profileId), eq(enrollments.courseId, courseId)))
    .limit(1)
  return Boolean(row)
}

// Matrícula gratuita (projeto fictício, sem pagamento); repetir não faz nada.
// Devolve true quando a matrícula é nova.
export async function enroll(profileId: string, courseId: number) {
  const [course] = await db()
    .select({ published: courses.published })
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1)
  if (!course?.published) throw new NotPublishedError()
  const created = await db()
    .insert(enrollments)
    .values({ profileId, courseId })
    .onConflictDoNothing()
    .returning({ courseId: enrollments.courseId })
  return created.length > 0
}

export async function completedLessonIds(profileId: string, lessonIds: number[]) {
  if (!lessonIds.length) return new Set<number>()
  const rows = await db()
    .select({ lessonId: lessonProgress.lessonId })
    .from(lessonProgress)
    .where(and(eq(lessonProgress.profileId, profileId), inArray(lessonProgress.lessonId, lessonIds)))
  return new Set(rows.map((row) => row.lessonId))
}

const nextLesson = (items: LessonItem[], done: Set<number>) =>
  (items.find((lesson) => !done.has(lesson.id)) ?? items[0])?.id ?? null

// Cursos em que a pessoa está matriculada, com o progresso de cada um
export async function listStudentCourses(profileId: string): Promise<StudentCourse[]> {
  const enrolled = await db()
    .select({ courseId: enrollments.courseId })
    .from(enrollments)
    .where(eq(enrollments.profileId, profileId))
  if (!enrolled.length) return []
  const ids = new Set(enrolled.map((row) => row.courseId))
  const summaries = (await listAllCourses()).filter((course) => ids.has(course.id))

  return Promise.all(
    summaries.map(async (summary) => {
      const outline = await getCourseBySlug(summary.slug)
      const items = outline ? allLessons(outline) : []
      const done = await completedLessonIds(
        profileId,
        items.map((lesson) => lesson.id),
      )
      return { ...summary, completedCount: done.size, nextLessonId: nextLesson(items, done) }
    }),
  )
}

export type LessonPlayer = {
  course: CourseOutline
  lesson: Lesson
  completed: number[]
  previousId: number | null
  nextId: number | null
  attachments: LessonAttachment[]
  // Segundo do vídeo em que a pessoa parou (0 = do começo)
  resumeAt: number
}

// Tudo o que a tela da aula precisa; null se a aula não é do curso ou a pessoa não tem acesso
export async function getLessonPlayer(
  profile: { id: string; role: 'student' | 'admin' },
  slug: string,
  lessonId: number,
): Promise<LessonPlayer | null> {
  const course = await getCourseBySlug(slug)
  if (!course) return null
  // Admin assiste qualquer curso, até rascunho, para revisar
  if (profile.role !== 'admin' && (!course.published || !(await isEnrolled(profile.id, course.id)))) return null

  const items = allLessons(course)
  const position = items.findIndex((lesson) => lesson.id === lessonId)
  const lesson = position >= 0 ? await getLesson(lessonId) : null
  if (!lesson) return null

  const [done, attachments, resumeAt] = await Promise.all([
    completedLessonIds(
      profile.id,
      items.map((item) => item.id),
    ),
    listAttachments(lessonId),
    savedPosition(profile.id, lessonId),
  ])
  return {
    course,
    lesson,
    completed: [...done],
    previousId: items[position - 1]?.id ?? null,
    nextId: items[position + 1]?.id ?? null,
    attachments,
    resumeAt,
  }
}

export async function firstPendingLesson(profileId: string, course: CourseOutline) {
  const items = allLessons(course)
  const done = await completedLessonIds(
    profileId,
    items.map((lesson) => lesson.id),
  )
  return nextLesson(items, done)
}

// Só marca aula de curso em que a pessoa está matriculada (admin pode em qualquer um)
export async function setLessonCompleted(
  profile: { id: string; role: 'student' | 'admin' },
  lessonId: number,
  completed: boolean,
) {
  const lesson = await getLesson(lessonId)
  if (!lesson) return false
  if (profile.role !== 'admin' && !(await isEnrolled(profile.id, lesson.courseId))) return false
  const profileId = profile.id
  if (completed) {
    await db().insert(lessonProgress).values({ profileId, lessonId }).onConflictDoNothing()
  } else {
    await db()
      .delete(lessonProgress)
      .where(and(eq(lessonProgress.profileId, profileId), eq(lessonProgress.lessonId, lessonId)))
  }
  return true
}

async function savedPosition(profileId: string, lessonId: number) {
  const [row] = await db()
    .select({ seconds: lessonPositions.seconds })
    .from(lessonPositions)
    .where(and(eq(lessonPositions.profileId, profileId), eq(lessonPositions.lessonId, lessonId)))
    .limit(1)
  return row?.seconds ?? 0
}

// Guarda onde a pessoa parou no vídeo; só para aula de curso em que está matriculada (ou admin)
export async function saveLessonPosition(
  profile: { id: string; role: 'student' | 'admin' },
  lessonId: number,
  seconds: number,
) {
  const lesson = await getLesson(lessonId)
  if (!lesson) return false
  if (profile.role !== 'admin' && !(await isEnrolled(profile.id, lesson.courseId))) return false
  await db()
    .insert(lessonPositions)
    .values({ profileId: profile.id, lessonId, seconds })
    .onConflictDoUpdate({
      target: [lessonPositions.profileId, lessonPositions.lessonId],
      set: { seconds, updatedAt: new Date() },
    })
  return true
}
