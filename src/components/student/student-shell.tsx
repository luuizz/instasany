'use client'

import { PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { site } from '@/config/site'
import { themeScript, type StudentMenu, type StudentTheme } from '@/lib/student-preferences'
import { cn } from '@/lib/utils'
import type { Inbox } from '@/types/notification'
import { NotificationBell } from './notification-bell'
import { SidebarContinue, type SidebarCourse } from './sidebar-continue'
import { StudentAccountMenu } from './student-account-menu'
import { StudentBottomNav } from './student-bottom-nav'
import { StudentNav } from './student-nav'
import { isFocusRoute } from './student-nav-items'
import { ThemeSwitch } from './theme-switch'
import { useStudentPreferences } from './use-student-preferences'

type StudentShellProps = {
  name: string
  email: string
  staff: boolean
  current: SidebarCourse | null
  initialTheme: StudentTheme
  initialMenu: StudentMenu
  inbox: Inbox
  children: React.ReactNode
}

// Marca em texto (o logo em imagem tem a palavra em branco e some no menu claro)
function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/aluno" aria-label={`${site.name}, área do aluno`} className="flex items-center gap-2.5">
      <span className="block w-10 shrink-0 overflow-hidden rounded-full bg-pine">
        <Image src="/brand/logo.svg" alt="" width={140} height={37} className="h-10 w-auto max-w-none" />
      </span>
      {!compact && (
        <>
          <span className="text-xl font-semibold text-ink">{site.name}</span>
          <span className="rounded-full bg-lime px-2 py-0.5 text-xs font-bold text-pine">Aluno</span>
        </>
      )}
    </Link>
  )
}

// Moldura da área do aluno, com paleta clara própria (o painel é verde-pinho), tema claro/escuro/automático
// e menu lateral recolhível. No celular: barra no topo e abas embaixo. Nada do cabeçalho do site público.
export function StudentShell(props: StudentShellProps) {
  const { name, email, staff, current, initialTheme, initialMenu, inbox, children } = props
  const { theme, setTheme, menu, setMenu } = useStudentPreferences(initialTheme, initialMenu)
  const focus = isFocusRoute(usePathname())
  const compact = menu === 'collapsed' || (menu === 'auto' && focus)
  const script = themeScript(initialTheme)
  const ToggleIcon = compact ? PanelLeftOpenIcon : PanelLeftCloseIcon

  return (
    <div
      className={cn(
        'min-h-svh bg-background text-ink lg:grid lg:transition-[grid-template-columns] lg:duration-300',
        initialTheme === 'dark' && 'dark',
        compact ? 'lg:grid-cols-[5.5rem_minmax(0,1fr)]' : 'lg:grid-cols-[17rem_minmax(0,1fr)]',
      )}
    >
      {script && <script dangerouslySetInnerHTML={{ __html: script }} />}
      <aside
        className={cn(
          'hidden flex-col gap-8 overflow-hidden border-r border-border bg-card lg:sticky lg:top-0 lg:flex lg:h-svh',
          compact ? 'px-3 py-6' : 'p-6',
        )}
      >
        <div className={cn('flex items-center justify-between gap-2', compact && 'flex-col gap-4')}>
          <Brand compact={compact} />
          <NotificationBell initial={inbox} />
        </div>
        <StudentNav compact={compact} staff={staff} />
        <div className="mt-auto flex flex-col gap-3">
          {!compact && current && <SidebarContinue course={current} />}
          <div className={cn('flex items-center gap-2', compact && 'flex-col')}>
            <div className={cn(!compact && 'flex-1')}>
              <ThemeSwitch theme={theme} onChange={setTheme} compact={compact} />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setMenu(compact ? 'open' : 'collapsed')}
                  aria-label={compact ? 'Abrir o menu' : 'Recolher o menu'}
                  aria-expanded={!compact}
                  className="flex size-9 items-center justify-center rounded-xl text-ink/65 transition hover:bg-secondary hover:text-ink"
                >
                  <ToggleIcon className="size-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{compact ? 'Abrir o menu' : 'Recolher o menu'}</TooltipContent>
            </Tooltip>
          </div>
          <StudentAccountMenu name={name} email={email} staff={staff} variant={compact ? 'compact' : 'sidebar'} />
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/95 px-4 py-3 backdrop-blur lg:hidden">
        <Brand />
        <div className="flex items-center gap-2">
          <NotificationBell initial={inbox} side="bottom" />
          <StudentAccountMenu
            name={name}
            email={email}
            staff={staff}
            variant="avatar"
            theme={{ value: theme, onChange: setTheme }}
          />
        </div>
      </header>

      <main className="min-w-0 px-4 pt-6 pb-28 sm:px-8 lg:px-10 lg:py-10 2xl:px-14">{children}</main>
      <StudentBottomNav />
    </div>
  )
}
