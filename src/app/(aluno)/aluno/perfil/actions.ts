'use server'

import { revalidatePath } from 'next/cache'
import { fail, ok, type ActionResult } from '@/lib/result'
import { changePasswordSchema, profileSchema } from '@/lib/validation/auth'
import { authErrorMessage } from '@/server/auth/errors'
import { getNeonAuth } from '@/server/auth/neon-auth'
import { requireUser } from '@/server/auth/session'
import { updateProfileName } from '@/server/services/profile'

const firstIssue = (issues: { message: string }[]) => issues[0]?.message ?? 'Confira os dados.'

// O nome fica no perfil da plataforma e também no Neon Auth, para os dois não divergirem
export async function updateProfileAction(_state: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const profile = await requireUser('/aluno/perfil')
  const parsed = profileSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return fail(firstIssue(parsed.error.issues))

  const auth = getNeonAuth()
  if (auth) {
    const { error } = await auth.updateUser({ name: parsed.data.name })
    if (error) return fail(authErrorMessage(error, 'Não foi possível salvar o nome. Tente de novo.'))
  }
  await updateProfileName(profile.id, parsed.data.name)
  revalidatePath('/aluno', 'layout')
  return ok(undefined)
}

// Troca a senha e encerra as outras sessões abertas
export async function changePasswordAction(_state: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireUser('/aluno/perfil')
  const auth = getNeonAuth()
  if (!auth) return fail('Login indisponível neste ambiente.')
  const parsed = changePasswordSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return fail(firstIssue(parsed.error.issues))

  const { error } = await auth.changePassword({
    currentPassword: parsed.data.currentPassword,
    newPassword: parsed.data.password,
    revokeOtherSessions: true,
  })
  if (error?.code === 'INVALID_PASSWORD' || error?.code === 'INVALID_EMAIL_OR_PASSWORD') {
    return fail('A senha atual está incorreta.')
  }
  if (error) return fail(authErrorMessage(error, 'Não foi possível trocar a senha. Tente de novo.'))
  return ok(undefined)
}
