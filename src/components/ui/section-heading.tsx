import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  eyebrow: string
  title: string
  tone?: 'light' | 'dark'
  align?: 'left' | 'center'
  className?: string
  children?: React.ReactNode
}

// Texto pequeno em verde + título grande, no padrão do topo da página
export function SectionHeading({
  eyebrow,
  title,
  tone = 'light',
  align = 'center',
  className,
  children,
}: SectionHeadingProps) {
  return (
    <div
      data-reveal-item
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'mx-auto max-w-3xl items-center text-center',
        className,
      )}
    >
      <p className={cn('font-medium sm:text-lg', tone === 'dark' ? 'text-sage-light' : 'text-sage')}>{eyebrow}</p>
      <h2
        className={cn(
          'text-3xl/tight font-semibold text-balance sm:text-5xl/tight',
          tone === 'dark' ? 'text-paper' : 'text-ink',
        )}
      >
        {title}
      </h2>
      {children}
    </div>
  )
}
