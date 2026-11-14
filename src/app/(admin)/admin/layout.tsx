import type { Metadata } from 'next'
import { AdminShell } from '@/components/admin/admin-shell'
import { cmsSections } from '@/config/cms'
import { requireAdmin } from '@/server/auth/session'

export const metadata: Metadata = { title: { default: 'Painel', template: '%s | Painel' }, robots: { index: false } }

const nav = [
  { href: '/admin', label: 'Visão geral' },
  ...cmsSections.map((section) => ({ href: `/admin/conteudo/${section.key}`, label: section.title })),
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
