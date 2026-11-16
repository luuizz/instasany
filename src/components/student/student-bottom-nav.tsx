'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { exploreLink, isActiveRoute, studentNav } from './student-nav-items'

// No celular cabem cinco abas: as seções principais e o catálogo (anotações ficam no menu da conta)
const tabs = [
  ...studentNav.filter((item) => item.href === '/aluno' || item.href === '/aluno/cursos'),
  { ...exploreLink, label: 'Explorar', exact: false },
  ...studentNav.filter((item) => item.href === '/aluno/certificados' || item.href === '/aluno/perfil'),
]

// No celular as seções da área do aluno ficam em abas fixas embaixo, como num app
export function StudentBottomNav() {
  const pathname = usePathname()
  return (
    <nav
      aria-label="Área do aluno"
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-card/95 px-2 pt-2 pb-3 backdrop-blur lg:hidden"
    >
      {tabs.map(({ href, label, icon: Icon, exact }) => {
        const active = isActiveRoute(pathname, href, exact)
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex flex-col items-center gap-1 rounded-2xl py-1.5 text-2xs font-medium transition',
              active ? 'text-pine dark:text-lime' : 'text-ink/50 hover:text-ink',
            )}
          >
            <span
              className={cn(
                'flex h-7 w-11 items-center justify-center rounded-full transition',
                active ? 'bg-lime text-pine' : 'bg-transparent',
              )}
            >
              <Icon className="size-5" />
            </span>
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
