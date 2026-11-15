import { cn } from '@/lib/utils'

type StatCardProps = {
  label: string
  value: number
  detail?: string
  icon: React.ReactNode
  featured?: boolean
  index?: number
}

const number = new Intl.NumberFormat('pt-BR')

// Número da visão geral; entra em sequência com os vizinhos (index)
export function StatCard({ label, value, detail, icon, featured, index = 0 }: StatCardProps) {
  return (
    <div
      style={{ animationDelay: `${index * 60}ms` }}
      className={cn(
        'flex animate-in flex-col gap-4 rounded-3xl p-6 duration-500 fill-mode-both fade-in slide-in-from-bottom-3',
        featured ? 'bg-pine text-paper' : 'border border-border bg-card',
      )}
    >
      <span
        className={cn(
          'flex size-10 items-center justify-center rounded-2xl [&_svg]:size-5',
          featured ? 'bg-lime text-pine' : 'bg-secondary text-pine',
        )}
      >
        {icon}
      </span>
      <div>
        <p className={cn('text-4xl font-semibold tabular-nums', featured ? 'text-lime' : 'text-ink')}>
          {number.format(value)}
        </p>
        <p className={cn('mt-1 text-sm font-medium', featured ? 'text-paper/80' : 'text-ink/70')}>{label}</p>
      </div>
      {detail && <p className={cn('text-xs', featured ? 'text-paper/60' : 'text-muted-foreground')}>{detail}</p>}
    </div>
  )
}
