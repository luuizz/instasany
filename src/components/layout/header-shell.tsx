'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

// Casca do cabeçalho: no topo se funde com a faixa escura da página; ao rolar vira uma pílula
// compacta e flutuante. A altura externa não muda, para o conteúdo não pular durante a rolagem.
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <header
      data-scrolled={scrolled || undefined}
      className={cn(
        'sticky top-0 z-30 flex h-20 items-start px-3 transition-colors duration-300 sm:px-4 lg:h-header',
        scrolled ? 'bg-transparent' : 'bg-pine',
      )}
    >
      <div
        className={cn(
          'mx-auto flex w-full items-center justify-between gap-6 transition-all duration-300 ease-out',
          scrolled
            ? 'mt-3 h-14 max-w-header-compact rounded-full bg-pine/90 pr-2 pl-4 shadow-xl shadow-ink/25 backdrop-blur-md sm:pl-5 lg:mt-4 lg:h-16'
            : 'h-20 max-w-grid px-1 sm:px-2 lg:h-header',
        )}
      >
        {children}
      </div>
    </header>
  )
}
