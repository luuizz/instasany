'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { mainNav } from '@/config/site'
import { cn } from '@/lib/utils'

// Menu principal: destaca a página atual (Cursos) ou, na home, a seção que está na tela
export function SiteNav() {
  const pathname = usePathname()
  const [section, setSection] = useState<string | null>(null)
  const onHome = pathname === '/'

  useEffect(() => {
    if (!onHome) return
    const sections = mainNav
      .filter((item) => item.href.startsWith('/#'))
      .map((item) => document.querySelector<HTMLElement>(item.href.slice(1)))
      .filter((element): element is HTMLElement => element !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setSection(`/#${visible.target.id}`)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [onHome])

  const isActive = (href: string) =>
    href.startsWith('/#') ? onHome && section === href : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <nav aria-label="Principal" className="flex items-center gap-0.5">
      {mainNav.map((item) => {
        const active = isActive(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition xl:px-4',
              active ? 'bg-lime text-pine' : 'text-paper/75 hover:bg-paper/10 hover:text-paper',
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
