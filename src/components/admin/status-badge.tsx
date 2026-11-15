import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// onImage: fundo sólido para ficar legível sobre a capa do curso
type StatusBadgeProps = { tone: 'live' | 'muted'; onImage?: boolean; children: React.ReactNode; className?: string }

export function StatusBadge({ tone, onImage, children, className }: StatusBadgeProps) {
  return (
    <Badge variant={tone} className={cn('gap-1.5', onImage && (tone === 'live' ? 'bg-lime' : 'bg-paper'), className)}>
      <span aria-hidden className={cn('size-1.5 rounded-full', tone === 'live' ? 'bg-pine' : 'bg-ink/40')} />
      {children}
    </Badge>
  )
}
