import 'server-only'
import { and, asc, eq, gt, lt, desc, max } from 'drizzle-orm'
import type { CourseInput, LessonInput } from '@/lib/validation/lms'
import type { Lesson } from '@/types/lms'
import { db } from '../db/client'
import { courseModules, courses, lessonAttachments, lessons } from '../db/schema'

export class SlugTakenError extends Error {}

const isUniqueViolation = (error: unknown) =>
  typeof error === 'object' && error !== null && 'cause' in error
    ? (error.cause as { code?: string } | undefined)?.code === '23505'
    : (error as { code?: string } | null)?.code === '23505'

export async function createCourse(input: CourseInput) {
  const [{ next } = { next: 0 }] = await db()
    .select({ next: max(courses.sortOrder) })
    .from(courses)
  try {
    const [created] = await db()
      .insert(courses)
      .values({ ...input, sortOrder: (next ?? 0) + 1 })
      .returning({ id: courses.id })
    if (!created) throw new Error('Curso não criado.')
    return created.id
  } catch (error) {
    if (isUniqueViolation(error)) throw new SlugTakenError()
    throw error
  }
}

export async function updateCourse(id: number, input: CourseInput) {
  try {
    await db()
      .update(courses)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(courses.id, id))
  } catch (error) {
    if (isUniqueViolation(error)) throw new SlugTakenError()
    throw error
  }
}

export async function deleteCourse(id: number) {
  await db().delete(courses).where(eq(courses.id, id))
}

// ---- módulos ----

export async function addModule(courseId: number, title: string) {
  const [{ last } = { last: 0 }] = await db()
    .select({ last: max(courseModules.sortOrder) })
    .from(courseModules)
    .where(eq(courseModules.courseId, courseId))
  await db()
    .insert(courseModules)
    .values({ courseId, title, sortOrder: (last ?? 0) + 1 })
}

export async function renameModule(id: number, title: string) {
  await db().update(courseModules).set({ title }).where(eq(courseModules.id, id))
}

export async function deleteModule(id: number) {
  await db().delete(courseModules).where(eq(courseModules.id, id))
}

type Direction = 'up' | 'down'

// Troca a posição com o vizinho de cima ou de baixo, dentro do mesmo curso
export async function moveModule(id: number, direction: Direction) {
  await db().transaction(async (tx) => {
    const [current] = await tx.select().from(courseModules).where(eq(courseModules.id, id)).limit(1)
    if (!current) return
    const [neighbor] = await tx
      .select()
      .from(courseModules)
      .where(
        and(
          eq(courseModules.courseId, current.courseId),
          direction === 'up'
            ? lt(courseModules.sortOrder, current.sortOrder)
            : gt(courseModules.sortOrder, current.sortOrder),
        ),
      )
      .orderBy(direction === 'up' ? desc(courseModules.sortOrder) : asc(courseModules.sortOrder))
      .limit(1)
    if (!neighbor) return
    await tx.update(courseModules).set({ sortOrder: neighbor.sortOrder }).where(eq(courseModules.id, current.id))
    await tx.update(courseModules).set({ sortOrder: current.sortOrder }).where(eq(courseModules.id, neighbor.id))
  })
}

// Mesma troca para aulas, dentro do mesmo módulo
export async function moveLesson(id: number, direction: Direction) {
  await db().transaction(async (tx) => {
    const [current] = await tx.select().from(lessons).where(eq(lessons.id, id)).limit(1)
    if (!current) return
    const [neighbor] = await tx
      .select()
      .from(lessons)
      .where(
        and(
          eq(lessons.moduleId, current.moduleId),
          direction === 'up' ? lt(lessons.sortOrder, current.sortOrder) : gt(lessons.sortOrder, current.sortOrder),
        ),
      )
      .orderBy(direction === 'up' ? desc(lessons.sortOrder) : asc(lessons.sortOrder))
      .limit(1)
    if (!neighbor) return
    await tx.update(lessons).set({ sortOrder: neighbor.sortOrder }).where(eq(lessons.id, current.id))
    await tx.update(lessons).set({ sortOrder: current.sortOrder }).where(eq(lessons.id, neighbor.id))
  })
}

// ---- aulas ----

export async function addLesson(moduleId: number) {
  const [{ last } = { last: 0 }] = await db()
    .select({ last: max(lessons.sortOrder) })
    .from(lessons)
    .where(eq(lessons.moduleId, moduleId))
  const [created] = await db()
    .insert(lessons)
    .values({ moduleId, title: 'Nova aula', sortOrder: (last ?? 0) + 1 })
    .returning({ id: lessons.id })
  if (!created) throw new Error('Aula não criada.')
  return created.id
}

export async function getLesson(id: number): Promise<(Lesson & { courseId: number }) | null> {
  const [row] = await db()
    .select({ lesson: lessons, courseId: courseModules.courseId })
    .from(lessons)
    .innerJoin(courseModules, eq(courseModules.id, lessons.moduleId))
    .where(eq(lessons.id, id))
    .limit(1)
  if (!row) return null
  const { lesson, courseId } = row
  return {
    id: lesson.id,
    moduleId: lesson.moduleId,
    title: lesson.title,
    content: lesson.content,
    videoUrl: lesson.videoUrl,
    durationMinutes: lesson.durationMinutes,
    hasVideo: Boolean(lesson.videoUrl),
    courseId,
  }
}

export async function updateLesson(id: number, input: LessonInput) {
  await db()
    .update(lessons)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(lessons.id, id))
}

export async function deleteLesson(id: number) {
  await db().delete(lessons).where(eq(lessons.id, id))
}

// Popula o LMS com os cursos fictícios de src/data, só quando ainda não há nenhum curso
export async function createDemoCourses() {
  const { demoCourses } = await import('@/data/demo-courses')
  return db().transaction(async (tx) => {
    const [existing] = await tx.select({ id: courses.id }).from(courses).limit(1)
    if (existing) return 0
    for (const [courseIndex, demo] of demoCourses.entries()) {
      const { modules, ...course } = demo
      const [created] = await tx
        .insert(courses)
        .values({ ...course, published: true, sortOrder: courseIndex + 1 })
        .returning({ id: courses.id })
      if (!created) continue
      for (const [moduleIndex, module] of modules.entries()) {
        const [createdModule] = await tx
          .insert(courseModules)
          .values({ courseId: created.id, title: module.title, sortOrder: moduleIndex + 1 })
          .returning({ id: courseModules.id })
        if (!createdModule) continue
        await tx.insert(lessons).values(
          module.lessons.map((lesson, lessonIndex) => ({
            moduleId: createdModule.id,
            title: lesson.title,
            content: lesson.content,
            durationMinutes: lesson.minutes,
            sortOrder: lessonIndex + 1,
          })),
        )
      }
    }
    return demoCourses.length
  })
}

// Endereços de arquivos (capa e vídeos) que deixam de ser usados ao excluir curso ou módulo
export async function courseFileUrls(courseId: number) {
  const [course] = await db().select({ coverUrl: courses.coverUrl }).from(courses).where(eq(courses.id, courseId))
  const videos = await db()
    .select({ url: lessons.videoUrl })
    .from(lessons)
    .innerJoin(courseModules, eq(courseModules.id, lessons.moduleId))
    .where(eq(courseModules.courseId, courseId))
  const attachments = await db()
    .select({ url: lessonAttachments.url })
    .from(lessonAttachments)
    .innerJoin(lessons, eq(lessons.id, lessonAttachments.lessonId))
    .innerJoin(courseModules, eq(courseModules.id, lessons.moduleId))
    .where(eq(courseModules.courseId, courseId))
  return [course?.coverUrl, ...videos.map((video) => video.url), ...attachments.map((file) => file.url)]
}

export async function moduleFileUrls(moduleId: number) {
  const videos = await db().select({ url: lessons.videoUrl }).from(lessons).where(eq(lessons.moduleId, moduleId))
  const attachments = await db()
    .select({ url: lessonAttachments.url })
    .from(lessonAttachments)
    .innerJoin(lessons, eq(lessons.id, lessonAttachments.lessonId))
    .where(eq(lessons.moduleId, moduleId))
  return [...videos.map((video) => video.url), ...attachments.map((file) => file.url)]
}

// Vídeo e materiais da aula, para apagar do Blob junto com ela
export async function lessonFileUrls(lessonId: number) {
  const [lesson] = await db().select({ url: lessons.videoUrl }).from(lessons).where(eq(lessons.id, lessonId))
  const attachments = await db()
    .select({ url: lessonAttachments.url })
    .from(lessonAttachments)
    .where(eq(lessonAttachments.lessonId, lessonId))
  return [lesson?.url, ...attachments.map((file) => file.url)]
}
