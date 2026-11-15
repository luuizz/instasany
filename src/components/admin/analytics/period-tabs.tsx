import Link from 'next/link'
import { ANALYTICS_PERIODS, type AnalyticsPeriod } from '@/lib/analytics'
import { cn } from '@/lib/utils'

export function PeriodTabs({ current }: { current: AnalyticsPeriod }) {
  return (
    <nav aria-label="Período" className="flex gap-1 rounded-full bg-muted p-1">
      {ANALYTICS_PERIODS.map((days) => (
        <Link
          key={days}
          href={days === 30 ? '/admin/analise' : `/admin/analise?periodo=${days}`}
          aria-current={days === current ? 'page' : undefined}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium transition',
            days === current ? 'bg-card text-pine shadow-sm' : 'text-muted-foreground hover:text-ink',
          )}
        >
          {days} dias
        </Link>
      ))}
    </nav>
  )
}
