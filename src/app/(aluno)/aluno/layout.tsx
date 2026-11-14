import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header'
import { requireUser } from '@/server/auth/session'

export const metadata: Metadata = { title: 'Área do aluno', robots: { index: false } }

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  await requireUser()
  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-var(--spacing-header))] bg-paper">{children}</main>
    </>
  )
}
