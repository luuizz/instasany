import type { Metadata } from 'next'
import { AdminShell } from '@/components/admin/admin-shell'
import { requireStaff } from '@/server/auth/session'

export const metadata: Metadata = { title: { default: 'Painel', template: '%s | Painel' }, robots: { index: false } }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Instrutor entra no painel só para os cursos; cada página do admin confere o papel de novo
  const profile = await requireStaff()
  return (
    <AdminShell userName={profile.name || profile.email} email={profile.email} role={profile.role}>
      {children}
    </AdminShell>
  )
}
