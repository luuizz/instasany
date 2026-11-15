'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { mainNav } from '@/config/site'
import { cn } from '@/lib/utils'
import type { HeaderAccount } from './site-header'

export function MobileMenu({ account }: { account: HeaderAccount }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        aria-expanded={open}
        aria-controls="menu-mobile"
        className="-mr-3 cursor-pointer p-3"
      >
        <Image src="/icons/menu.svg" alt="" width={24} height={24} />
      </button>

      <div
        onClick={close}
        aria-hidden
        className={cn(
          'fixed inset-0 bg-ink/60 transition-opacity',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
      <aside
        id="menu-mobile"
        aria-label="Menu"
        inert={!open}
        className={cn(
          'fixed inset-y-0 right-0 flex w-72 max-w-[85vw] flex-col gap-8 bg-pine p-6 transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Fechar menu"
          className="cursor-pointer self-end p-1 text-3xl leading-none text-paper"
        >
          ×
        </button>
        <nav aria-label="Principal" className="flex flex-col gap-1">
          {mainNav.map((item) => (
            <a
              key={item.href}
              href={`/${item.href}`}
              onClick={close}
              className="rounded-full px-4 py-3 text-paper/70 hover:bg-pine-line hover:text-paper"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <Link
          href="/cursos"
          onClick={close}
          className="rounded-full px-4 py-3 text-paper/70 hover:bg-pine-line hover:text-paper"
        >
          Cursos
        </Link>
        <Link
          href={account.href}
          onClick={close}
          className="mt-auto flex items-center gap-2 px-4 font-medium text-paper"
        >
          <Image src="/icons/user.svg" alt="" width={24} height={24} />
          {account.label}
        </Link>
      </aside>
    </div>
  )
}
