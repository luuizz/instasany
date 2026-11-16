import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type ErrorScreenProps = {
  code: string
  title: string
  description: string
  icon: LucideIcon
  // dark: tela cheia na cor da marca; inline: dentro de uma moldura (site, área do aluno, painel)
  tone?: 'dark' | 'inline'
  children?: React.ReactNode
}

// Tela de erro da marca: código grande ao fundo, ícone, texto e as ações em children
export function ErrorScreen({ code, title, description, icon: Icon, tone = 'inline', children }: ErrorScreenProps) {
  const dark = tone === 'dark'
  return (
    <section
      className={cn(
        'relative isolate flex flex-col items-center justify-center overflow-hidden px-6 text-center',
        dark ? 'min-h-svh bg-pine text-paper' : 'py-20 text-ink sm:py-28',
      )}
    >
      {dark && <span aria-hidden className="absolute inset-0 -z-10 cover-art" />}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 text-9xl font-bold tracking-tighter select-none sm:scale-200',
          dark ? 'text-paper/5' : 'text-ink/5',
        )}
      >
        {code}
      </span>
      <span
        className={cn(
          'mb-6 flex size-16 animate-in items-center justify-center rounded-3xl duration-500 zoom-in-90',
          dark ? 'bg-lime text-pine' : 'bg-secondary text-pine dark:text-lime',
        )}
      >
        <Icon className="size-8" />
      </span>
      <p className={cn('text-sm font-semibold tracking-widest uppercase', dark ? 'text-lime' : 'text-sage')}>
        Erro {code}
      </p>
      <h1 className="mt-3 max-w-xl text-4xl font-semibold text-balance sm:text-5xl">{title}</h1>
      <p className={cn('mt-4 max-w-md text-lg', dark ? 'text-paper/70' : 'text-ink/60')}>{description}</p>
      {children && <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{children}</div>}
    </section>
  )
}
