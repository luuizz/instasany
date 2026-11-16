'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { fail, ok, type ActionResult } from '@/lib/result'
import { reviewSchema } from '@/lib/validation/lms'
import { requireUser } from '@/server/auth/session'
import { issueCertificate } from '@/server/services/certificates'
import { REVIEWS_TAG } from '@/server/services/courses'
import { saveReview } from '@/server/services/reviews'

// Emite o certificado (ou abre o que já existe) e leva para a página dele
export async function issueCertificateAction(slug: string) {
  const profile = await requireUser(`/aluno/cursos/${slug}`)
  const code = await issueCertificate(profile, slug)
  if (!code) redirect(`/aluno/cursos/${slug}`)
  revalidatePath('/aluno', 'layout')
  redirect(`/certificado/${code}`)
}

export async function saveReviewAction(
  courseId: number,
  slug: string,
  _state: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const profile = await requireUser(`/aluno/cursos/${slug}`)
  const parsed = reviewSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? 'Confira a avaliação.')
  if (!(await saveReview(profile.id, courseId, parsed.data))) return fail('Só quem está matriculado pode avaliar.')
  updateTag(REVIEWS_TAG)
  revalidatePath(`/cursos/${slug}`)
  revalidatePath('/cursos')
  return ok(undefined)
}
