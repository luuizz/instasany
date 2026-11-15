import type { Metadata } from 'next'
import { AdminShell } from '@/components/admin/admin-shell'
import { requireAdmin } from '@/server/auth/session'

export const metadata: Metadata = { title: { default: 'Painel', template: '%s | Painel' }, robots: { index: false } }

const nav = [
  { href: '/admin/cursos', label: 'Cursos' },
  { href: '/admin', label: 'Conteúdo do site' },
  { href: '/', label: 'Ver o site' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAdmin()
  return (
    <AdminShell userName={profile.name || profile.email} nav={nav}>
      {children}
    </AdminShell>
  )
}
