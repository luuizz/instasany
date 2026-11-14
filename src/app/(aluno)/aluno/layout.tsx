import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header'
import { requireUser } from '@/server/auth/session'

export const metadata: Metadata = { title: 'Área do aluno', robots: { index: false } }

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireUser()
  const firstName = profile.name.split(' ')[0] || 'Minha área'
  return (
    <>
      <SiteHeader account={{ label: firstName, href: '/aluno' }} />
      <main className="min-h-[calc(100svh-var(--spacing-header))] bg-paper">{children}</main>
    </>
  )
}
