'use client'

import { useEffect, useState } from 'react'
import { mainNav } from '@/config/site'
import { cn } from '@/lib/utils'

// Destaca no menu a seção que está na tela
export function SiteNav() {
  const [active, setActive] = useState<string>(mainNav[0].href)

  useEffect(() => {
    const sections = mainNav
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((section): section is HTMLElement => section !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setActive(`#${visible.target.id}`)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <nav aria-label="Principal" className="flex gap-2">
      {mainNav.map((item) => (
        <a
          key={item.href}
          href={`/${item.href}`}
          aria-current={active === item.href ? 'location' : undefined}
          className={cn(
            'rounded-full px-3 py-1 transition',
            active === item.href ? 'bg-sage text-paper' : 'text-paper/40 hover:text-paper',
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}
