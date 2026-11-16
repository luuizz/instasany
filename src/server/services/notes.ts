import 'server-only'
import { and, desc, eq } from 'drizzle-orm'
import { isStaff, type Role } from '@/lib/roles'
import type { StudentNote } from '@/types/lms'
import { db } from '../db/client'
import { courseModules, courses, lessonNotes, lessons } from '../db/schema'
import { getLesson } from './course-admin'
import { isEnrolled } from './learning'

export async function getNote(profileId: string, lessonId: number) {
  const [row] = await db()
    .select({ content: lessonNotes.content, updatedAt: lessonNotes.updatedAt })
    .from(lessonNotes)
    .where(and(eq(lessonNotes.profileId, profileId), eq(lessonNotes.lessonId, lessonId)))
  return row ?? null
}

// Grava a anotação (texto vazio apaga). Só quem está matriculado no curso, ou a equipe, escreve.
export async function saveNote(profile: { id: string; role: Role }, lessonId: number, content: string) {
  const lesson = await getLesson(lessonId)
  if (!lesson) return null
  if (!isStaff(profile.role) && !(await isEnrolled(profile.id, lesson.courseId))) return null
  const where = and(eq(lessonNotes.profileId, profile.id), eq(lessonNotes.lessonId, lessonId))
  if (!content.trim()) {
    await db().delete(lessonNotes).where(where)
    return { updatedAt: new Date() }
  }
  const [row] = await db()
    .insert(lessonNotes)
    .values({ profileId: profile.id, lessonId, content })
    .onConflictDoUpdate({
      target: [lessonNotes.profileId, lessonNotes.lessonId],
      set: { content, updatedAt: new Date() },
    })
    .returning({ updatedAt: lessonNotes.updatedAt })
  return row ?? null
}

// Todas as anotações da pessoa, da mais recente para a mais antiga
export async function listNotes(profileId: string): Promise<StudentNote[]> {
  return db()
    .select({
      lessonId: lessons.id,
      lessonTitle: lessons.title,
      courseTitle: courses.title,
      courseSlug: courses.slug,
      content: lessonNotes.content,
      updatedAt: lessonNotes.updatedAt,
    })
    .from(lessonNotes)
    .innerJoin(lessons, eq(lessons.id, lessonNotes.lessonId))
    .innerJoin(courseModules, eq(courseModules.id, lessons.moduleId))
    .innerJoin(courses, eq(courses.id, courseModules.courseId))
    .where(eq(lessonNotes.profileId, profileId))
    .orderBy(desc(lessonNotes.updatedAt))
}
