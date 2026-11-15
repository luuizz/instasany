import { cn } from '@/lib/utils'

// onImage: fundo sólido para ficar legível sobre a capa do curso
type StatusBadgeProps = { tone: 'live' | 'muted'; onImage?: boolean; children: React.ReactNode; className?: string }

export function StatusBadge({ tone, onImage, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold',
        tone === 'live' ? 'bg-lime/40 text-pine' : 'bg-ink/10 text-ink/60',
        onImage && (tone === 'live' ? 'bg-lime' : 'bg-paper'),
        className,
      )}
    >
      <span aria-hidden className={cn('size-1.5 rounded-full', tone === 'live' ? 'bg-pine' : 'bg-ink/40')} />
      {children}
    </span>
  )
}
