'use server'

import { firstNameOf } from '@/lib/account'
import { clientEventSchema } from '@/lib/validation/analytics'
import { getCurrentProfile } from '@/server/auth/session'
import { recordClientEvent } from '@/server/services/analytics'
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

// Evento de uso enviado pelo navegador (página vista, play e tempo de vídeo). Falha aqui
// nunca atrapalha a navegação: o erro só vai para o log.
export async function trackEventAction(input: unknown): Promise<void> {
  const parsed = clientEventSchema.safeParse(input)
  if (!parsed.success) return
  try {
    await recordClientEvent(parsed.data, await getCurrentProfile())
  } catch (error) {
    console.error('[análise] não foi possível gravar o evento:', error)
  }
}
