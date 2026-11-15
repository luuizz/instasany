'use server'

import { firstNameOf } from '@/lib/account'
import { getCurrentProfile } from '@/server/auth/session'
import type { HeaderAccount } from '@/types/account'

// O site é estático; o cabeçalho pergunta quem está logado depois de carregar
export async function getHeaderAccountAction(): Promise<HeaderAccount | null> {
  try {
    const profile = await getCurrentProfile()
    if (!profile) return null
    return {
      firstName: firstNameOf(profile.name, profile.email),
      isAdmin: profile.role === 'admin',
    }
  } catch (error) {
    console.error('[cabeçalho] não foi possível ler a sessão:', error)
    return null
  }
}
