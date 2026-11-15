'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { fail, ok, type ActionResult } from '@/lib/result'
import { slugify } from '@/lib/slug'
import { attachmentSchema, courseSchema, lessonSchema, moduleSchema } from '@/lib/validation/lms'
import { requireAdmin } from '@/server/auth/session'
import * as admin from '@/server/services/course-admin'
import { addAttachment, removeAttachment } from '@/server/services/attachments'
import { COURSES_TAG, getCourseById } from '@/server/services/courses'
import type { LessonAttachment } from '@/types/lms'
import { deleteStoredFiles } from '@/server/integrations/storage'

export type FormState = ActionResult<{ savedAt: string }> | null

// Arquivo substituído ou removido sai do Blob depois da resposta
const cleanUp = (urls: (string | null | undefined)[]) => after(() => deleteStoredFiles(urls))

const firstError = (issues: { message: string }[]) => issues[0]?.message ?? 'Confira os campos.'

function refresh(courseId?: number) {
  updateTag(COURSES_TAG)
  revalidatePath('/cursos', 'layout')
  revalidatePath('/admin/cursos', 'layout')
  if (courseId) revalidatePath(`/admin/cursos/${courseId}`, 'layout')
}

// ---- cursos ----

export async function saveCourseAction(
  courseId: number | null,
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin()
  const title = String(formData.get('title') ?? '')
  const parsed = courseSchema.safeParse({
    title,
    slug: String(formData.get('slug') ?? '').trim() || slugify(title),
    summary: formData.get('summary') ?? '',
    description: formData.get('description') ?? '',
    level: formData.get('level'),
    coverUrl: formData.get('coverUrl') ?? '',
    published: formData.has('published'),
  })
  if (!parsed.success) return fail(firstError(parsed.error.issues))

  try {
    if (courseId === null) {
      const id = await admin.createCourse(parsed.data)
      refresh(id)
      redirect(`/admin/cursos/${id}`)
    }
    const previous = await getCourseById(courseId)
    await admin.updateCourse(courseId, parsed.data)
    if (previous?.coverUrl !== parsed.data.coverUrl) cleanUp([previous?.coverUrl])
  } catch (error) {
    if (error instanceof admin.SlugTakenError) return fail('Já existe um curso com esse endereço. Escolha outro.')
    throw error
  }
  refresh(courseId)
  return ok({ savedAt: new Date().toISOString() })
}

export async function deleteCourseAction(courseId: number) {
  await requireAdmin()
  const files = await admin.courseFileUrls(courseId)
  await admin.deleteCourse(courseId)
  cleanUp(files)
  refresh()
  redirect('/admin/cursos')
}

export async function createDemoCoursesAction() {
  await requireAdmin()
  await admin.createDemoCourses()
  refresh()
}

// ---- módulos ----

export async function addModuleAction(courseId: number, _state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin()
  const parsed = moduleSchema.safeParse({ title: formData.get('title') ?? '' })
  if (!parsed.success) return fail(firstError(parsed.error.issues))
  await admin.addModule(courseId, parsed.data.title)
  refresh(courseId)
  return ok({ savedAt: new Date().toISOString() })
}

export async function renameModuleAction(
  moduleId: number,
  courseId: number,
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin()
  const parsed = moduleSchema.safeParse({ title: formData.get('title') ?? '' })
  if (!parsed.success) return fail(firstError(parsed.error.issues))
  await admin.renameModule(moduleId, parsed.data.title)
  refresh(courseId)
  return ok({ savedAt: new Date().toISOString() })
}

export async function deleteModuleAction(moduleId: number, courseId: number) {
  await requireAdmin()
  const files = await admin.moduleFileUrls(moduleId)
  await admin.deleteModule(moduleId)
  cleanUp(files)
  refresh(courseId)
}

export async function moveModuleAction(moduleId: number, courseId: number, direction: 'up' | 'down') {
  await requireAdmin()
  await admin.moveModule(moduleId, direction)
  refresh(courseId)
}

// ---- aulas ----

export async function addLessonAction(moduleId: number, courseId: number) {
  await requireAdmin()
  const id = await admin.addLesson(moduleId)
  refresh(courseId)
  redirect(`/admin/cursos/${courseId}/aulas/${id}`)
}

export async function saveLessonAction(
  lessonId: number,
  courseId: number,
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin()
  const parsed = lessonSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return fail(firstError(parsed.error.issues))
  const previous = await admin.getLesson(lessonId)
  await admin.updateLesson(lessonId, parsed.data)
  if (previous?.videoUrl !== parsed.data.videoUrl) cleanUp([previous?.videoUrl])
  refresh(courseId)
  return ok({ savedAt: new Date().toISOString() })
}

export async function deleteLessonAction(lessonId: number, courseId: number) {
  await requireAdmin()
  const files = await admin.lessonFileUrls(lessonId)
  await admin.deleteLesson(lessonId)
  cleanUp(files)
  refresh(courseId)
  redirect(`/admin/cursos/${courseId}`)
}

export async function moveLessonAction(lessonId: number, courseId: number, direction: 'up' | 'down') {
  await requireAdmin()
  await admin.moveLesson(lessonId, direction)
  refresh(courseId)
}

// ---- materiais da aula ----

function refreshLesson(lessonId: number, courseId: number) {
  revalidatePath(`/admin/cursos/${courseId}/aulas/${lessonId}`)
  revalidatePath('/aluno/cursos', 'layout')
}

export async function addAttachmentAction(
  lessonId: number,
  courseId: number,
  input: unknown,
): Promise<ActionResult<LessonAttachment>> {
  await requireAdmin()
  const parsed = attachmentSchema.safeParse(input)
  if (!parsed.success) return fail(firstError(parsed.error.issues))
  const created = await addAttachment(lessonId, parsed.data)
  if (!created) return fail('Não foi possível salvar o material.')
  refreshLesson(lessonId, courseId)
  return ok(created)
}

export async function removeAttachmentAction(lessonId: number, courseId: number, attachmentId: number) {
  await requireAdmin()
  const url = await removeAttachment(lessonId, attachmentId)
  if (url) cleanUp([url])
  refreshLesson(lessonId, courseId)
}
