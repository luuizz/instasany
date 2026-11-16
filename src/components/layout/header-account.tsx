'use client'

import { LayoutDashboardIcon } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useHeaderAccount } from './header-account-context'

// Desktop: "Fazer login" para visitantes; nome e atalho do painel para quem está logado
export function HeaderAccountLinks() {
  const account = useHeaderAccount()

  if (account === 'loading') {
    // Ocupa o mesmo espaço para o cabeçalho não pular quando a resposta chega
    return <span aria-hidden className="h-6 w-28" />
  }

  if (!account) {
    return (
      <Link
        href="/entrar"
        className="flex h-10 animate-in items-center rounded-full bg-lime px-5 text-sm font-semibold whitespace-nowrap text-pine duration-300 fade-in hover:bg-lime/85"
      >
        Fazer login
      </Link>
    )
  }

  return (
    <div className="flex animate-in items-center gap-3 duration-300 fade-in">
      {account.isAdmin && (
        <Link
          href="/admin"
          aria-label="Painel"
          className="flex items-center gap-2 rounded-full px-3 py-1.5 font-medium whitespace-nowrap text-paper/70 transition hover:bg-pine-line hover:text-paper"
        >
          <LayoutDashboardIcon className="size-4" />
          <span className="hidden xl:inline">Painel</span>
        </Link>
      )}
      <AccountLink firstName={account.firstName} />
    </div>
  )
}

export function AccountLink({ firstName, className }: { firstName: string; className?: string }) {
  return (
    <Link
      href="/aluno"
      className={cn(
        'group flex max-w-48 items-center gap-2 rounded-full bg-paper/10 py-1 pr-4 pl-1 text-sm font-medium whitespace-nowrap text-paper transition hover:bg-paper/15',
        className,
      )}
    >
      <Avatar aria-hidden className="size-8">
        <AvatarFallback className="bg-lime text-sm font-bold text-pine">{firstName[0]?.toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className="truncate">Olá, {firstName}</span>
    </Link>
  )
}
