import { cn } from '@/lib/utils'

const dayLabel = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' })
const fullLabel = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', timeZone: 'UTC' })
const asDate = (day: string) => new Date(`${day}T00:00:00Z`)

type Point = { day: string; value: number }

// Aulas concluídas por dia: uma série, barras finas com o número no topo e tabela para leitores de tela
export function CompletionsChart({ points }: { points: Point[] }) {
  const max = Math.max(1, ...points.map((point) => point.value))
  const total = points.reduce((sum, point) => sum + point.value, 0)
  return (
    <section aria-labelledby="aulas-dia" className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="aulas-dia" className="text-lg font-semibold">
          Aulas concluídas por dia
        </h2>
        <p className="text-sm text-muted-foreground tabular-nums">
          {total} nos últimos {points.length} dias
        </p>
      </div>
      <ol aria-hidden className="mt-6 flex h-40 items-end gap-1.5 border-b border-border">
        {points.map((point, index) => {
          const today = index === points.length - 1
          return (
            <li
              key={point.day}
              title={`${fullLabel.format(asDate(point.day))}: ${point.value}`}
              className="flex h-full flex-1 flex-col items-center justify-end gap-1"
            >
              {point.value > 0 && (
                <span className="text-2xs font-semibold text-muted-foreground tabular-nums">{point.value}</span>
              )}
              <span
                className={cn('w-full max-w-6 rounded-t-md', today ? 'bg-pine' : 'bg-sage/70')}
                style={{ height: `${(point.value / max) * 85}%`, minHeight: point.value ? 3 : 0 }}
              />
            </li>
          )
        })}
      </ol>
      <ol aria-hidden className="mt-2 flex gap-1.5">
        {points.map((point, index) => (
          <li key={point.day} className="flex-1 text-center text-2xs text-muted-foreground">
            {index % 2 === points.length % 2 || index === points.length - 1
              ? index === points.length - 1
                ? 'hoje'
                : dayLabel.format(asDate(point.day))
              : ''}
          </li>
        ))}
      </ol>
      <table className="sr-only">
        <caption>Aulas concluídas por dia</caption>
        <tbody>
          {points.map((point) => (
            <tr key={point.day}>
              <th scope="row">{fullLabel.format(asDate(point.day))}</th>
              <td>{point.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
