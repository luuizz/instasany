'use client'

import {
  ChevronsUpDownIcon,
  ExternalLinkIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  NotebookPenIcon,
  UserRoundIcon,
} from 'lucide-react'
import Link from 'next/link'
import { signOut } from '@/app/(auth)/actions'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { parseTheme, type StudentTheme } from '@/lib/student-preferences'
import { cn } from '@/lib/utils'
import { themeOptions } from './theme-switch'

type StudentAccountMenuProps = {
  name: string
  email: string
  staff: boolean
  variant: 'sidebar' | 'compact' | 'avatar'
  // No celular o tema é escolhido aqui, já que não há menu lateral
  theme?: { value: StudentTheme; onChange: (theme: StudentTheme) => void }
}

// Conta da área do aluno: perfil, painel (equipe), site e sair num dropdown do shadcn
export function StudentAccountMenu({ name, email, staff, variant, theme }: StudentAccountMenuProps) {
  const initial = name.trim()[0]?.toUpperCase()
  const full = variant === 'sidebar'
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Sua conta"
        className={cn(
          'flex cursor-pointer items-center gap-3 rounded-2xl text-left text-sm transition outline-none focus-visible:ring-4 focus-visible:ring-lime/30',
          full && 'w-full bg-secondary p-3 hover:bg-secondary/70 data-[state=open]:bg-secondary/70',
          variant === 'compact' && 'mx-auto p-1 hover:bg-secondary',
          variant === 'avatar' && 'rounded-full',
        )}
      >
        <Avatar className="size-9">
          <AvatarFallback className="bg-lime font-bold text-pine">{initial}</AvatarFallback>
        </Avatar>
        {full && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium text-ink">{name}</span>
              <span className="block truncate text-xs text-ink/50">{email}</span>
            </span>
            <ChevronsUpDownIcon className="size-4 text-ink/50" />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={variant === 'avatar' ? 'bottom' : 'top'}
        align={variant === 'avatar' ? 'end' : 'start'}
        className="min-w-56 rounded-2xl p-1.5"
      >
        {!full && (
          <div className="px-2 py-1.5">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
        )}
        <DropdownMenuItem asChild className="cursor-pointer rounded-xl">
          <Link href="/aluno/perfil">
            <UserRoundIcon />
            Meu perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer rounded-xl">
          <Link href="/aluno/anotacoes">
            <NotebookPenIcon />
            Minhas anotações
          </Link>
        </DropdownMenuItem>
        {staff && (
          <DropdownMenuItem asChild className="cursor-pointer rounded-xl">
            <Link href="/admin">
              <LayoutDashboardIcon />
              Painel
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild className="cursor-pointer rounded-xl">
          <Link href="/">
            <ExternalLinkIcon />
            Ver o site
          </Link>
        </DropdownMenuItem>
        {theme && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Tema</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={theme.value} onValueChange={(value) => theme.onChange(parseTheme(value))}>
              {themeOptions.map(({ id, label, icon: Icon }) => (
                <DropdownMenuRadioItem key={id} value={id} className="cursor-pointer rounded-xl">
                  <Icon />
                  {label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" className="cursor-pointer rounded-xl" onSelect={() => void signOut()}>
          <LogOutIcon />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
