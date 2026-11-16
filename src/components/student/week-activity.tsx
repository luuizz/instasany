import type { StudentDashboard } from '@/types/lms'

const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', timeZone: 'UTC' })

// Aulas concluídas por dia na última semana: barras simples, uma série só, com o número em cima
export function WeekActivity({ week }: { week: StudentDashboard['week'] }) {
  const max = Math.max(1, ...week.map((day) => day.count))
  const total = week.reduce((sum, day) => sum + day.count, 0)
  return (
    <section aria-labelledby="semana" className="rounded-3xl border border-ink/10 bg-card p-5">
      <div className="flex items-baseline justify-between">
        <h2 id="semana" className="font-semibold text-ink">
          Sua semana
        </h2>
        <p className="text-sm text-ink/65">
          {total} {total === 1 ? 'aula' : 'aulas'}
        </p>
      </div>
      <ol className="mt-5 flex h-32 items-end gap-2" aria-label="Aulas concluídas por dia">
        {week.map((day, index) => {
          const label = weekday.format(new Date(`${day.day}T00:00:00Z`)).replace('.', '')
          const today = index === week.length - 1
          return (
            <li key={day.day} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              <span className="text-xs font-semibold text-ink/70 tabular-nums">{day.count || ''}</span>
              <span
                className={today ? 'w-full rounded-t-md bg-pine' : 'w-full rounded-t-md bg-sage/70'}
                style={{ height: `${Math.max((day.count / max) * 100, day.count ? 8 : 3)}%` }}
              />
              <span className={today ? 'text-xs font-semibold text-pine dark:text-lime' : 'text-xs text-ink/65'}>
                {today ? 'hoje' : label}
              </span>
              <span className="sr-only">
                {day.count} {day.count === 1 ? 'aula' : 'aulas'}
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
