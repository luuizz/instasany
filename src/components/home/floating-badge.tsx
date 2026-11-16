import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// Ícone decorativo em círculo de vidro, flutuando ao lado do título do hero
export function FloatingBadge({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <span
      className={cn(
        'absolute flex size-14 items-center justify-center rounded-full bg-paper/5 text-lime shadow-lg ring-1 shadow-ink/30 ring-paper/15 backdrop-blur-sm',
        className,
      )}
    >
      <Icon className="size-6 fill-lime/20" strokeWidth={1.75} />
    </span>
  )
}
