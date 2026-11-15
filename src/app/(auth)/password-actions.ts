'use server'

import { redirect } from 'next/navigation'
import { site } from '@/config/site'
import { fail, ok } from '@/lib/result'
import { forgotPasswordSchema, resetPasswordSchema } from '@/lib/validation/auth'
import { authErrorMessage } from '@/server/auth/errors'
import { getNeonAuth } from '@/server/auth/neon-auth'
import type { AuthFormState } from './actions'

const unavailable = fail('Login indisponível neste ambiente.')
const firstIssue = (issues: { message: string }[]) => issues[0]?.message ?? 'Confira os dados.'

// O Neon Auth envia o e-mail com o link; ele volta para /redefinir-senha com o token.
// A resposta é a mesma com ou sem conta, para não revelar quais e-mails estão cadastrados.
export async function requestPasswordResetAction(_state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const auth = getNeonAuth()
  if (!auth) return unavailable
  const parsed = forgotPasswordSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return fail(firstIssue(parsed.error.issues))

  const { error } = await auth.requestPasswordReset({
    email: parsed.data.email,
    redirectTo: `${site.url}/redefinir-senha`,
  })
  if (error?.status === 429) return fail(authErrorMessage(error, ''))
  if (error) authErrorMessage(error, '')
  return ok({
    message:
      'Se houver uma conta com este e-mail, enviamos um link para criar uma senha nova. Ele vale por 15 minutos.',
  })
}

export async function resetPasswordAction(_state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const auth = getNeonAuth()
  if (!auth) return unavailable
  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return fail(firstIssue(parsed.error.issues))

  const { error } = await auth.resetPassword({ newPassword: parsed.data.password, token: parsed.data.token })
  if (error) return fail(authErrorMessage(error, 'Não foi possível trocar a senha. Peça um novo link.'))
  redirect('/entrar?senha=nova')
}
