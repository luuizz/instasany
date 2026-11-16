'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { site } from '@/config/site'
import { cn } from '@/lib/utils'
import { SidebarContinue, type SidebarCourse } from './sidebar-continue'
import { StudentAccountMenu } from './student-account-menu'
import { StudentBottomNav } from './student-bottom-nav'
import { StudentNav } from './student-nav'
import { isFocusRoute } from './student-nav-items'

type StudentShellProps = {
  name: string
  email: string
  staff: boolean
  current: SidebarCourse | null
  children: React.ReactNode
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/aluno" aria-label={`${site.name}, área do aluno`} className="flex items-center gap-3">
      <span className={cn('block overflow-hidden', compact && 'w-10')}>
        <Image src="/brand/logo.svg" alt="" width={140} height={37} className="h-10 w-auto max-w-none" />
      </span>
      {!compact && <span className="rounded-full bg-lime px-2 py-0.5 text-xs font-bold text-pine">Aluno</span>}
    </Link>
  )
}

// Moldura da área do aluno: menu lateral no desktop (só ícones na aula e no quiz),
// barra no topo e abas embaixo no celular. Nada do cabeçalho do site público.
export function StudentShell({ name, email, staff, current, children }: StudentShellProps) {
  const compact = isFocusRoute(usePathname())
  return (
    <div
      className={cn(
        'min-h-svh bg-muted/40 lg:grid',
        compact ? 'lg:grid-cols-[5.5rem_minmax(0,1fr)]' : 'lg:grid-cols-[17rem_minmax(0,1fr)]',
      )}
    >
      <aside
        className={cn(
          'hidden flex-col gap-8 bg-pine lg:sticky lg:top-0 lg:flex lg:h-svh',
          compact ? 'items-stretch px-3 py-6' : 'p-6',
        )}
      >
        <div className={cn(compact && 'flex justify-center')}>
          <Brand compact={compact} />
        </div>
        <StudentNav compact={compact} staff={staff} />
        <div className="mt-auto flex flex-col gap-3">
          {!compact && current && <SidebarContinue course={current} />}
          <StudentAccountMenu name={name} email={email} staff={staff} variant={compact ? 'compact' : 'sidebar'} />
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between bg-pine px-4 py-3 lg:hidden">
        <Brand />
        <StudentAccountMenu name={name} email={email} staff={staff} variant="avatar" />
      </header>

      <main className="min-w-0 px-4 pt-6 pb-28 sm:px-8 lg:px-10 lg:py-10 2xl:px-14">{children}</main>
      <StudentBottomNav />
    </div>
  )
}
