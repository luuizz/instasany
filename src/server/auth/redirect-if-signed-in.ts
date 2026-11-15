import 'server-only'
import { homeFor } from '@/lib/roles'
import { redirect } from 'next/navigation'
import { getCurrentProfile } from './session'

// Quem já está logado não vê as telas de entrar e cadastro
export async function redirectIfSignedIn(back: string | null) {
  const profile = await getCurrentProfile()
  if (profile) redirect(back ?? homeFor(profile.role))
}
