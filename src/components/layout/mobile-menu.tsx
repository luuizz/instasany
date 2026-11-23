'use client'

import { ArrowUpRightIcon, MenuIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { mainNav, site } from '@/config/site'
import { cn } from '@/lib/utils'
import { MobileMenuAccount } from './mobile-menu-account'

const stagger = 'animate-in fade-in slide-in-from-right-6 fill-mode-both duration-500 ease-out'

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Abrir menu"
          className="rounded-full text-paper hover:bg-paper/10 hover:text-paper"
        >
          <MenuIcon className="size-6" />
        </Button>
      </SheetTrigger>

      <SheetContent
        id="menu-mobile"
        showCloseButton={false}
        className="w-full gap-0 border-none bg-pine p-0 text-paper sm:max-w-md"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <SheetTitle className="text-lg font-bold text-paper">{site.name}</SheetTitle>
          <SheetDescription className="sr-only">Navegação do site e acesso à sua conta</SheetDescription>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Fechar menu"
              className="-mr-2 rounded-full bg-paper/10 hover:bg-paper/20 hover:text-paper"
            >
              <XIcon className="size-5" />
            </Button>
          </SheetClose>
        </div>

        <nav aria-label="Principal" className="flex flex-1 flex-col justify-center overflow-y-auto px-4">
          <ol className="flex flex-col">
            {mainNav.map((item, index) => {
              const active = item.href === pathname
              return (
                <li key={item.href} className={stagger} style={{ animationDelay: `${80 + index * 60}ms` }}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-pine-line focus-visible:bg-pine-line',
                      active && 'bg-pine-line',
                    )}
                  >
                    <span className="w-6 text-xs font-medium text-paper/60 tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={cn(
                        'flex-1 text-3xl font-semibold tracking-tight text-paper/85 transition-colors group-hover:text-paper',
                        active && 'text-lime group-hover:text-lime',
                      )}
                    >
                      {item.label}
                    </span>
                    <ArrowUpRightIcon
                      aria-hidden
                      className="size-5 -translate-x-1 text-lime opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                    />
                  </Link>
                </li>
              )
            })}
          </ol>
        </nav>

        <div
          className={cn(stagger, 'border-t border-pine-line px-6 pt-5 pb-8')}
          style={{ animationDelay: `${120 + mainNav.length * 60}ms` }}
          onClick={(event) => {
            if ((event.target as HTMLElement).closest('a')) close()
          }}
        >
          <MobileMenuAccount />
        </div>
      </SheetContent>
    </Sheet>
  )
}
