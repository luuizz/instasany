'use client'

import { LayoutDashboardIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { exploreLink, isActiveRoute, studentNav } from './student-nav-items'

type NavLinkProps = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  active?: boolean
  compact: boolean
}

function NavLink({ href, label, icon: Icon, active = false, compact }: NavLinkProps) {
  const link = (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      aria-label={compact ? label : undefined}
      className={cn(
        'group relative flex items-center gap-3 rounded-2xl py-2.5 font-medium transition-all duration-200',
        compact ? 'justify-center px-0' : 'px-4',
        active ? 'bg-secondary text-ink' : 'text-ink/60 hover:bg-secondary/70 hover:text-ink',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-full bg-lime transition-all duration-300',
          active ? 'opacity-100' : 'h-0 opacity-0',
        )}
      />
      <Icon
        className={cn(
          'size-5 shrink-0 transition-colors',
          active ? 'text-sage dark:text-lime' : 'group-hover:text-ink',
        )}
      />
      {!compact && label}
    </Link>
  )
  if (!compact) return link
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}

// Menu lateral da área do aluno, com a página atual destacada
export function StudentNav({ compact, staff }: { compact: boolean; staff: boolean }) {
  const pathname = usePathname()
  return (
    <nav aria-label="Área do aluno" className="flex flex-col gap-1">
      {studentNav.map((item) => (
        <NavLink key={item.href} {...item} compact={compact} active={isActiveRoute(pathname, item.href, item.exact)} />
      ))}
      <span aria-hidden className="my-3 h-px bg-border" />
      <NavLink {...exploreLink} compact={compact} />
      {staff && <NavLink href="/admin" label="Painel" icon={LayoutDashboardIcon} compact={compact} />}
    </nav>
  )
}
