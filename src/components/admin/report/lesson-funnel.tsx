import { TrendingDownIcon } from 'lucide-react'
import type { LessonFunnelItem } from '@/types/course-report'

const number = new Intl.NumberFormat('pt-BR')

// Quantos dos matriculados concluíram cada aula, na ordem do curso, com a maior queda em destaque
export function LessonFunnel({ items }: { items: LessonFunnelItem[] }) {
  if (items.length === 0) return <p className="rounded-2xl bg-muted p-6 text-sm text-muted-foreground">Sem aulas.</p>
  const biggest = items.reduce((top, item) => (item.drop > top.drop ? item : top), items[0]!)
  const modules = [...new Set(items.map((item) => item.moduleTitle))]
  return (
    <div className="flex flex-col gap-6">
      {modules.map((moduleTitle) => (
        <div key={moduleTitle} className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-wider text-sage uppercase">{moduleTitle}</p>
          <ol className="flex flex-col gap-3">
            {items
              .filter((item) => item.moduleTitle === moduleTitle)
              .map((item) => {
                const isDrop = item === biggest && item.drop >= 10
                return (
                  <li key={item.lessonId} className="flex flex-col gap-1.5">
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="truncate font-medium text-ink">{item.title}</span>
                        {isDrop && (
                          <span className="flex shrink-0 items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
                            <TrendingDownIcon className="size-3" />
                            maior queda: −{item.drop} pts
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 tabular-nums">
                        {number.format(item.completed)}
                        <span className="ml-2 text-xs text-muted-foreground">{item.percent}%</span>
                      </span>
                    </div>
                    <span className="h-2 overflow-hidden rounded-full bg-muted">
                      <span
                        className={
                          isDrop ? 'block h-full rounded-full bg-destructive/70' : 'block h-full rounded-full bg-sage'
                        }
                        style={{ width: `${item.percent}%` }}
                      />
                    </span>
                  </li>
                )
              })}
          </ol>
        </div>
      ))}
    </div>
  )
}
