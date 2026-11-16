import { FlameIcon } from 'lucide-react'
import type { StreakInfo } from '@/lib/streak'
import { cn } from '@/lib/utils'

const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'narrow', timeZone: 'UTC' })

function message(streak: StreakInfo) {
  if (!streak.current) return 'Assista uma aula hoje para começar uma sequência.'
  if (!streak.studiedToday) return 'Estude hoje para não perder a sequência.'
  return streak.current >= streak.longest
    ? 'É o seu recorde. Continue assim!'
    : `Seu recorde é de ${streak.longest} dias.`
}

// Dias seguidos estudando, com os últimos 7 dias marcados
export function StreakCard({ streak }: { streak: StreakInfo }) {
  const alive = streak.current > 0
  return (
    <section aria-labelledby="sequencia" className="relative overflow-hidden rounded-3xl bg-pine p-5 text-paper">
      <span aria-hidden className="absolute inset-0 opacity-60 cover-art" />
      <div className="relative flex items-center gap-4">
        <span
          className={cn(
            'flex size-14 shrink-0 items-center justify-center rounded-2xl',
            alive ? 'bg-lime text-pine' : 'bg-paper/10 text-paper/60',
          )}
        >
          <FlameIcon className={cn('size-7', alive && 'fill-pine/20')} />
        </span>
        <div>
          <h2 id="sequencia" className="text-sm text-paper/60">
            Sequência de estudo
          </h2>
          <p className="text-3xl font-semibold tabular-nums">
            {streak.current} {streak.current === 1 ? 'dia' : 'dias'}
          </p>
        </div>
      </div>
      <ol className="relative mt-5 grid grid-cols-7 gap-1.5" aria-label="Últimos 7 dias">
        {streak.lastWeek.map((item, index) => (
          <li key={item.day} className="flex flex-col items-center gap-1.5">
            <span
              className={cn(
                'flex size-7 items-center justify-center rounded-full text-2xs font-bold',
                item.active ? 'bg-lime text-pine' : 'bg-paper/10 text-paper/40',
                index === 6 && !item.active && 'ring-2 ring-lime/50',
              )}
            >
              {weekday.format(new Date(`${item.day}T00:00:00Z`)).toUpperCase()}
            </span>
            <span className="sr-only">{item.active ? 'estudou' : 'sem estudo'}</span>
          </li>
        ))}
      </ol>
      <p className="relative mt-4 text-sm text-paper/70">{message(streak)}</p>
    </section>
  )
}
