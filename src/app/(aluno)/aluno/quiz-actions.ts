'use server'

import { revalidatePath } from 'next/cache'
import { fail, ok, type ActionResult } from '@/lib/result'
import { quizAnswersSchema } from '@/lib/validation/lms'
import { requireUser } from '@/server/auth/session'
import { submitQuiz } from '@/server/services/quiz'
import type { QuizResult } from '@/types/lms'

export async function submitQuizAction(input: unknown): Promise<ActionResult<QuizResult>> {
  const profile = await requireUser()
  const parsed = quizAnswersSchema.safeParse(input)
  if (!parsed.success) return fail('Respostas inválidas. Recarregue a página e tente de novo.')
  const result = await submitQuiz(profile, parsed.data.quizId, parsed.data.answers)
  if (!result) return fail('Este quiz não está disponível para você.')
  revalidatePath('/aluno', 'layout')
  return ok(result)
}
