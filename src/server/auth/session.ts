import 'server-only'
import { isStaff } from '@/lib/roles'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { cache } from 'react'
import { db } from '../db/client'
import { profiles, type ProfileRow } from '../db/schema'
import { getNeonAuth } from './neon-auth'

export type SessionUser = { id: string; email: string; name: string }
export type Profile = Pick<ProfileRow, 'id' | 'email' | 'name' | 'role' | 'emailReminders'>

// E-mails que viram admin no primeiro acesso (lista separada por vírgula)
const adminEmails = () =>
  (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)

export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  // Sessão é sempre por requisição, mesmo quando o login não está configurado
  await connection()
  const auth = getNeonAuth()
  if (!auth) return null
  const { data } = await auth.getSession()
  const user = data?.user
  return user?.id ? { id: user.id, email: user.email, name: user.name ?? '' } : null
})

const columns = {
  id: profiles.id,
  email: profiles.email,
  name: profiles.name,
  role: profiles.role,
  emailReminders: profiles.emailReminders,
}

// Perfil do usuário do Neon Auth; a linha é criada no primeiro acesso
export async function ensureProfile(user: SessionUser): Promise<Profile> {
  const [existing] = await db().select(columns).from(profiles).where(eq(profiles.id, user.id)).limit(1)
  if (existing) return existing

  const role = adminEmails().includes(user.email.toLowerCase()) ? 'admin' : 'student'
  const [created] = await db()
    .insert(profiles)
    .values({ id: user.id, email: user.email, name: user.name, role })
    .onConflictDoUpdate({ target: profiles.id, set: { email: user.email } })
    .returning(columns)
  if (!created) throw new Error('Não foi possível criar o perfil.')
  return created
}

export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const user = await getSessionUser()
  return user ? ensureProfile(user) : null
})

export async function requireUser(back = '/aluno') {
  const profile = await getCurrentProfile()
  if (!profile) redirect(`/entrar?volta=${encodeURIComponent(back)}`)
  return profile
}

export async function requireAdmin(back = '/admin') {
  const profile = await requireUser(back)
  if (profile.role !== 'admin') redirect(profile.role === 'instructor' ? '/admin/cursos' : '/aluno')
  return profile
}

// Instrutor ou admin: editar o conteúdo dos cursos
export async function requireStaff(back = '/admin/cursos') {
  const profile = await requireUser(back)
  if (!isStaff(profile.role)) redirect('/aluno')
  return profile
}
