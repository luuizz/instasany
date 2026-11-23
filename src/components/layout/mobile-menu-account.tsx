'use client'

import { ArrowRightIcon, LayoutDashboardIcon } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useHeaderAccount } from './header-account-context'

/** Rodapé do menu do celular: cartão da conta para quem está logado, convite para entrar para quem não está. */
export function MobileMenuAccount() {
  const account = useHeaderAccount()

  if (account === 'loading') return <div className="h-16" aria-hidden />

  if (!account) {
    return (
      <div className="flex flex-col gap-3">
        <Link
          href="/cadastro"
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-lime font-semibold text-pine transition hover:brightness-95"
        >
          Começar agora
          <ArrowRightIcon className="size-4" />
        </Link>
        <p className="text-center text-sm text-paper/60">
          Já tem conta?{' '}
          <Link href="/entrar" className="font-semibold text-paper underline-offset-4 hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <Link
        href="/aluno"
        className="group flex items-center gap-3 rounded-2xl bg-paper/10 p-3 transition hover:bg-paper/15"
      >
        <Avatar aria-hidden className="size-11">
          <AvatarFallback className="bg-lime text-base font-bold text-pine">
            {account.firstName[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-semibold">Olá, {account.firstName}</span>
          <span className="text-sm text-paper/60">Ir para a área do aluno</span>
        </span>
        <ArrowRightIcon className="size-5 text-lime transition group-hover:translate-x-0.5" />
      </Link>
      {account.isAdmin && (
        <Link
          href="/admin"
          className="flex h-11 items-center justify-center gap-2 rounded-full border border-pine-line text-sm font-medium text-paper/85 transition hover:bg-pine-line hover:text-paper"
        >
          <LayoutDashboardIcon className="size-4" />
          Painel
        </Link>
      )}
    </div>
  )
}
