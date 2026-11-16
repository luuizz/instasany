'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { fail, ok, type ActionResult } from '@/lib/result'
import { reviewSchema } from '@/lib/validation/lms'
import { requireUser } from '@/server/auth/session'
import { issueCertificate } from '@/server/services/certificates'
import { pushNotification } from '@/server/services/inbox'
import { REVIEWS_TAG } from '@/server/services/courses'
import { saveReview } from '@/server/services/reviews'

// Emite o certificado (ou abre o que já existe) e leva para a página dele
export async function issueCertificateAction(slug: string) {
  const profile = await requireUser(`/aluno/cursos/${slug}`)
  const issued = await issueCertificate(profile, slug)
  if (!issued) redirect(`/aluno/cursos/${slug}`)
  if (issued.created)
    after(() =>
      pushNotification(profile.id, {
        kind: 'certificate',
        title: 'Seu certificado está pronto',
        body: `${issued.courseTitle}. Que tal adicionar ao seu perfil do LinkedIn?`,
        href: `/certificado/${issued.code}`,
      }),
    )
  revalidatePath('/aluno', 'layout')
  redirect(`/certificado/${issued.code}`)
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
