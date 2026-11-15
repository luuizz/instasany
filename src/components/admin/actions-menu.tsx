'use client'

import { MoreHorizontalIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Spinner } from '@/components/ui/spinner'

type MenuLink = { href: string; label: string; icon: React.ReactNode; external?: boolean }
type Danger = { label: string; title: string; description: string; run: () => Promise<void> }

// Menu "mais ações" do topo das páginas do painel; a ação destrutiva pede confirmação
export function ActionsMenu({ links, danger }: { links: MenuLink[]; danger: Danger }) {
  const [confirming, setConfirming] = useState(false)
  const [pending, startTransition] = useTransition()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Mais ações">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-52 rounded-2xl p-1.5">
          {links.map((link) => (
            <DropdownMenuItem key={link.href} asChild className="cursor-pointer rounded-xl">
              <Link href={link.href} target={link.external ? '_blank' : undefined}>
                {link.icon}
                {link.label}
              </Link>
            </DropdownMenuItem>
          ))}
          {links.length > 0 && <DropdownMenuSeparator />}
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer rounded-xl"
            onSelect={() => setConfirming(true)}
          >
            <Trash2Icon />
            {danger.label}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirming} onOpenChange={(open) => !pending && setConfirming(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{danger.title}</AlertDialogTitle>
            <AlertDialogDescription>{danger.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructiveSolid"
              disabled={pending}
              onClick={(event) => {
                event.preventDefault()
                startTransition(() => danger.run())
              }}
            >
              {pending && <Spinner />}
              {danger.label}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
