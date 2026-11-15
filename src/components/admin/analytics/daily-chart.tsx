'use client'

import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { DailyPoint } from '@/types/analytics'

const number = new Intl.NumberFormat('pt-BR')
const dayLabel = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', timeZone: 'UTC' })
const axisLabel = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' })
const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', timeZone: 'UTC' })
const asDate = (day: string) => new Date(`${day}T00:00:00Z`)

// Teto do eixo arredondado para cima (1, 2, 5, 10, 20, 50...)
function niceMax(value: number) {
  if (value <= 4) return 4
  const power = 10 ** Math.floor(Math.log10(value))
  return ([1, 2, 5, 10].find((step) => step * power >= value) ?? 10) * power
}

// Páginas vistas por dia: uma série só, barras finas, dica ao passar o mouse e tabela para leitura
export function DailyChart({ points }: { points: DailyPoint[] }) {
  const max = niceMax(Math.max(...points.map((point) => point.pageViews), 0))
  const ticks = [max, max / 2, 0]
  const labelEvery = Math.ceil(points.length / 6)

  return (
    <figure className="flex flex-col gap-3">
      <div className="flex gap-3">
        <div
          aria-hidden
          className="flex h-56 w-8 shrink-0 flex-col justify-between text-right text-xs text-muted-foreground tabular-nums"
        >
          {ticks.map((tick) => (
            <span key={tick} className="-my-2">
              {number.format(tick)}
            </span>
          ))}
        </div>
        <div className="relative h-56 flex-1">
          <div aria-hidden className="absolute inset-0 flex flex-col justify-between">
            {ticks.map((tick) => (
              <span key={tick} className="border-t border-border" />
            ))}
          </div>
          <div className="absolute inset-0 flex items-end gap-0.5" role="img" aria-label="Páginas vistas por dia">
            {points.map((point) => (
              <Tooltip key={point.day}>
                <TooltipTrigger asChild>
                  <span className="group flex h-full flex-1 cursor-default items-end" tabIndex={0}>
                    <span
                      className="w-full rounded-t-sm bg-sage transition-colors group-hover:bg-pine group-focus-visible:bg-pine"
                      style={{ height: `${(point.pageViews / max) * 100}%`, minHeight: point.pageViews ? 2 : 0 }}
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">
                    {dayLabel.format(asDate(point.day))} · {weekday.format(asDate(point.day))}
                  </p>
                  <p>{number.format(point.pageViews)} páginas vistas</p>
                  <p>{number.format(point.visitors)} visitantes</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
      <div aria-hidden className="relative ml-11 h-4 text-xs text-muted-foreground">
        {points.map((point, index) =>
          index % labelEvery === 0 ? (
            <span
              key={point.day}
              className={cn(
                'absolute -translate-x-1/2 whitespace-nowrap',
                (index / labelEvery) % 2 === 1 && 'max-sm:hidden',
              )}
              style={{ left: `${((index + 0.5) / points.length) * 100}%` }}
            >
              {axisLabel.format(asDate(point.day))}
            </span>
          ) : null,
        )}
      </div>
      <details className="text-sm">
        <summary className="cursor-pointer text-muted-foreground hover:text-ink">Ver em tabela</summary>
        <table className="mt-3 w-full text-left">
          <thead className="text-muted-foreground">
            <tr>
              <th className="py-1 font-medium">Dia</th>
              <th className="py-1 text-right font-medium">Páginas vistas</th>
              <th className="py-1 text-right font-medium">Visitantes</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {points.map((point) => (
              <tr key={point.day} className="border-t border-border">
                <td className="py-1">{dayLabel.format(asDate(point.day))}</td>
                <td className="py-1 text-right">{number.format(point.pageViews)}</td>
                <td className="py-1 text-right">{number.format(point.visitors)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  )
}
