import type { RankedItem } from '@/types/analytics'

const number = new Intl.NumberFormat('pt-BR')

// Lista ordenada com barra proporcional ao maior valor (páginas mais vistas)
export function RankedBars({ items, empty }: { items: RankedItem[]; empty: string }) {
  if (items.length === 0) return <p className="rounded-2xl bg-muted p-6 text-sm text-muted-foreground">{empty}</p>
  const max = Math.max(...items.map((item) => item.value), 1)
  return (
    <ol className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.label} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate font-medium text-ink">{item.label}</span>
            <span className="shrink-0 tabular-nums">
              {number.format(item.value)}
              {item.detail && <span className="ml-2 text-xs text-muted-foreground">{item.detail}</span>}
            </span>
          </div>
          <span className="h-2 overflow-hidden rounded-full bg-muted">
            <span className="block h-full rounded-full bg-sage" style={{ width: `${(item.value / max) * 100}%` }} />
          </span>
        </li>
      ))}
    </ol>
  )
}
