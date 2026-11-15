import type { Metadata } from 'next'
import { AdminShell } from '@/components/admin/admin-shell'
import { requireAdmin } from '@/server/auth/session'

export const metadata: Metadata = { title: { default: 'Painel', template: '%s | Painel' }, robots: { index: false } }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAdmin()
  return <AdminShell userName={profile.name || profile.email}>{children}</AdminShell>
}
