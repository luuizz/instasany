'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { fail, ok, type ActionResult } from '@/lib/result'
import { quizSchema } from '@/lib/validation/lms'
import { requireAdmin } from '@/server/auth/session'
import { COURSES_TAG } from '@/server/services/courses'
import { deleteQuiz, saveQuiz } from '@/server/services/quiz'

function refresh(courseId: number) {
  updateTag(COURSES_TAG)
  revalidatePath(`/admin/cursos/${courseId}`, 'layout')
  revalidatePath('/aluno/cursos', 'layout')
}

const parseJson = (value: FormDataEntryValue | null): unknown => {
  try {
    return JSON.parse(String(value ?? ''))
  } catch {
    return null
  }
}

// O editor envia o quiz inteiro como JSON no campo "quiz"
export async function saveQuizAction(
  moduleId: number,
  courseId: number,
  _state: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin()
  const parsed = quizSchema.safeParse(parseJson(formData.get('quiz')))
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? 'Confira as perguntas.')
  await saveQuiz(moduleId, parsed.data)
  refresh(courseId)
  return ok(undefined)
}

export async function deleteQuizAction(moduleId: number, courseId: number) {
  await requireAdmin()
  await deleteQuiz(moduleId)
  refresh(courseId)
  redirect(`/admin/cursos/${courseId}`)
}
