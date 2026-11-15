'use client'

import { ChevronsUpDownIcon, ExternalLinkIcon, GraduationCapIcon, LogOutIcon } from 'lucide-react'
import Link from 'next/link'
import { signOut } from '@/app/(auth)/actions'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Conta no rodapé do menu do painel: atalhos e sair num dropdown do shadcn
export function AccountMenu({ userName, email }: { userName: string; email: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-pine-line/60 p-3 text-left text-sm transition outline-none hover:bg-pine-line focus-visible:ring-4 focus-visible:ring-lime/30 data-[state=open]:bg-pine-line">
        <Avatar className="size-9">
          <AvatarFallback className="bg-lime font-bold text-pine">{userName.trim()[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium text-paper">{userName}</span>
          <span className="block truncate text-xs text-paper/50">{email}</span>
        </span>
        <ChevronsUpDownIcon className="size-4 text-paper/50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="start"
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-2xl p-1.5"
      >
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Conectado como admin
        </DropdownMenuLabel>
        <DropdownMenuItem asChild className="cursor-pointer rounded-xl">
          <Link href="/aluno">
            <GraduationCapIcon />
            Área do aluno
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer rounded-xl">
          <Link href="/">
            <ExternalLinkIcon />
            Ver o site
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" className="cursor-pointer rounded-xl" onSelect={() => void signOut()}>
          <LogOutIcon />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
