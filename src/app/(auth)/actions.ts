'use server'

import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { fail, type ActionResult } from '@/lib/result'
import { safeBack, signInSchema, signUpSchema } from '@/lib/validation/auth'
import { authErrorMessage } from '@/server/auth/errors'
import { getNeonAuth } from '@/server/auth/neon-auth'
import { ensureProfile } from '@/server/auth/session'
import { notifyWelcome } from '@/server/services/notifications'

export type AuthFormState = ActionResult<{ message: string }> | null

const unavailable = fail('Login indisponível neste ambiente.')

type AuthUser = { id: string; email: string; name?: string | null }

// Admin vai para o painel, aluno para a área do aluno, salvo se veio de uma página protegida
async function destinationFor(user: AuthUser, back: string | null) {
  const profile = await ensureProfile({ id: user.id, email: user.email, name: user.name ?? '' })
  return back ?? (profile.role === 'admin' ? '/admin' : '/aluno')
}

export async function signIn(_state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const auth = getNeonAuth()
  if (!auth) return unavailable
  const parsed = signInSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? 'Confira os dados.')

  const { data, error } = await auth.signIn.email(parsed.data)
  if (error || !data?.user) return fail(authErrorMessage(error, 'Não foi possível entrar. Tente de novo.'))
  redirect(await destinationFor(data.user, safeBack(formData.get('volta'))))
}

export async function signUp(_state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const auth = getNeonAuth()
  if (!auth) return unavailable
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? 'Confira os dados.')

  const { data, error } = await auth.signUp.email(parsed.data)
  if (error || !data?.user) return fail(authErrorMessage(error, 'Não foi possível criar a conta. Tente de novo.'))
  after(() => notifyWelcome({ name: parsed.data.name, email: parsed.data.email }))
  // Com confirmação de e-mail ligada no Neon Auth, a conta nasce sem sessão
  if (!data.token) {
    return { ok: true, data: { message: 'Conta criada! Confirme seu e-mail pelo link que enviamos e depois entre.' } }
  }
  redirect(await destinationFor(data.user, safeBack(formData.get('volta'))))
}

export async function signOut() {
  await getNeonAuth()?.signOut()
  redirect('/')
}
