'use server'

import { z } from 'zod'
import { requireUser } from '@/server/auth/session'
import { getInbox, markRead } from '@/server/services/inbox'

// O sino busca os avisos ao abrir e de tempos em tempos enquanto a aba está visível
export async function getInboxAction() {
  const profile = await requireUser()
  return getInbox(profile.id)
}

const markSchema = z.object({ id: z.number().int().positive().optional() })

// Marca um aviso (ou todos) como lido e devolve o sino atualizado
export async function markInboxReadAction(input: unknown) {
  const parsed = markSchema.safeParse(input ?? {})
  const profile = await requireUser()
  await markRead(profile.id, parsed.success ? parsed.data.id : undefined)
  return getInbox(profile.id)
}
