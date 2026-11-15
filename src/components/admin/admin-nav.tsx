'use client'

import {
  ChartColumnIcon,
  ExternalLinkIcon,
  GraduationCapIcon,
  LayoutDashboardIcon,
  MessageCircleQuestionIcon,
  PanelsTopLeftIcon,
  UsersIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const items = [
  { href: '/admin', label: 'Visão geral', icon: LayoutDashboardIcon, exact: true },
  { href: '/admin/cursos', label: 'Cursos', icon: GraduationCapIcon },
  { href: '/admin/alunos', label: 'Alunos', icon: UsersIcon },
  { href: '/admin/duvidas', label: 'Dúvidas', icon: MessageCircleQuestionIcon },
  { href: '/admin/analise', label: 'Análise', icon: ChartColumnIcon },
  { href: '/admin/conteudo', label: 'Conteúdo do site', icon: PanelsTopLeftIcon },
]

// Menu do painel com a página atual destacada; onNavigate fecha o menu no celular
export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href))

  return (
    <nav aria-label="Painel" className="flex flex-col gap-1">
      {items.map(({ href, label, icon: Icon, exact }) => {
        const active = isActive(href, exact)
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'group relative flex items-center gap-3 rounded-2xl px-4 py-2.5 font-medium transition-all duration-200',
              active ? 'bg-pine-line text-paper' : 'text-paper/60 hover:bg-pine-line/60 hover:text-paper',
            )}
          >
            <span
              aria-hidden
              className={cn(
                'absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-full bg-lime transition-all duration-300',
                active ? 'opacity-100' : 'h-0 opacity-0',
              )}
            />
            <Icon className={cn('size-5 transition-colors', active ? 'text-lime' : 'group-hover:text-paper')} />
            {label}
          </Link>
        )
      })}
      <Link
        href="/"
        onClick={onNavigate}
        className="mt-4 flex items-center gap-3 rounded-2xl px-4 py-2.5 font-medium text-paper/60 transition hover:bg-pine-line/60 hover:text-paper"
      >
        <ExternalLinkIcon className="size-5" />
        Ver o site
      </Link>
    </nav>
  )
}
