'use client'

import { LayoutDashboardIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { mainNav } from '@/config/site'
import { AccountLink } from './header-account'
import { useHeaderAccount } from './header-account-context'

const linkClass = 'rounded-full px-4 py-3 text-paper/70 transition hover:bg-pine-line hover:text-paper'

// Menu do site no celular: gaveta lateral (Sheet do shadcn) com navegação e conta
export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const account = useHeaderAccount()
  const close = () => setOpen(false)

  return (
    <div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Abrir menu" className="-mr-2 hover:bg-pine-line">
            <Image src="/icons/menu.svg" alt="" width={24} height={24} />
          </Button>
        </SheetTrigger>
        <SheetContent
          id="menu-mobile"
          className="w-72 gap-6 border-pine-line bg-pine p-6 pt-14 text-paper [&>button]:text-paper"
        >
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <nav aria-label="Principal" className="flex flex-col gap-1">
            {mainNav.map((item) => (
              <Link key={item.href} href={item.href} onClick={close} className={linkClass}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-2" onClick={close}>
            {account === 'loading' ? null : account ? (
              <>
                {account.isAdmin && (
                  <Link href="/admin" className={`${linkClass} flex items-center gap-2`}>
                    <LayoutDashboardIcon className="size-4" />
                    Painel
                  </Link>
                )}
                <AccountLink firstName={account.firstName} className="self-start" />
              </>
            ) : (
              <Link href="/entrar" className="flex items-center gap-2 px-4 font-medium text-paper">
                <Image src="/icons/user.svg" alt="" width={24} height={24} />
                Fazer login
              </Link>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
