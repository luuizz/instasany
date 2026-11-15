'use server'

import { revalidatePath } from 'next/cache'
import { after } from 'next/server'
import { fail, ok, type ActionResult } from '@/lib/result'
import { questionMessageSchema } from '@/lib/validation/lms'
import { requireUser } from '@/server/auth/session'
import { notifyAnswer } from '@/server/services/notifications'
import { askQuestion, deleteQuestionMessage, replyToQuestion } from '@/server/services/questions'

const lessonPath = (slug: string, lessonId: number) => `/aluno/cursos/${slug}/aulas/${lessonId}`

function refresh(slug: string, lessonId: number) {
  revalidatePath(lessonPath(slug, lessonId))
  revalidatePath('/admin/duvidas')
}

export async function askQuestionAction(
  lessonId: number,
  slug: string,
  _state: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const profile = await requireUser(lessonPath(slug, lessonId))
  const parsed = questionMessageSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? 'Confira a mensagem.')
  if (!(await askQuestion(profile, lessonId, parsed.data.body))) return fail('Só quem está matriculado pode perguntar.')
  refresh(slug, lessonId)
  return ok(undefined)
}

export async function replyQuestionAction(
  questionId: number,
  slug: string,
  lessonId: number,
  _state: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const profile = await requireUser(lessonPath(slug, lessonId))
  const parsed = questionMessageSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? 'Confira a mensagem.')
  if (!(await replyToQuestion(profile, questionId, parsed.data.body)))
    return fail('Não foi possível responder esta dúvida.')
  after(() => notifyAnswer(questionId, profile, slug, parsed.data.body))
  refresh(slug, lessonId)
  return ok(undefined)
}

export async function deleteQuestionAction(messageId: number, slug: string, lessonId: number) {
  const profile = await requireUser(lessonPath(slug, lessonId))
  await deleteQuestionMessage(profile, messageId)
  refresh(slug, lessonId)
}
