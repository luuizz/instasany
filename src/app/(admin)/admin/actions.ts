'use server'

import { cookies } from 'next/headers'
import { ADMIN_VIEW_COOKIE, parseAdminView } from '@/lib/admin-view'
import { requireAdmin } from '@/server/auth/session'

// Guarda a visualização escolhida (lista ou grade); a página recarrega com o cookie novo
export async function setAdminViewAction(value: string) {
  await requireAdmin()
  ;(await cookies()).set(ADMIN_VIEW_COOKIE, parseAdminView(value), {
    path: '/admin',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    httpOnly: true,
  })
}
