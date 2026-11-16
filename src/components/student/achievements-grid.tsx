import {
  AwardIcon,
  BookOpenCheckIcon,
  CalendarCheckIcon,
  FlameIcon,
  FootprintsIcon,
  GraduationCapIcon,
  LayersIcon,
  LockIcon,
  NotebookPenIcon,
  TargetIcon,
  type LucideIcon,
} from 'lucide-react'
import type { Achievement } from '@/lib/achievements'
import { cn } from '@/lib/utils'

const icons: Record<string, LucideIcon> = {
  'primeira-aula': FootprintsIcon,
  'dez-aulas': BookOpenCheckIcon,
  modulo: LayersIcon,
  gabarito: TargetIcon,
  anotador: NotebookPenIcon,
  'sequencia-3': FlameIcon,
  'sequencia-7': CalendarCheckIcon,
  curso: GraduationCapIcon,
  certificado: AwardIcon,
}

// Conquistas: as liberadas em destaque, as outras com o quanto falta
export function AchievementsGrid({ achievements }: { achievements: Achievement[] }) {
  const unlocked = achievements.filter((item) => item.unlocked).length
  return (
    <section aria-labelledby="conquistas-lista">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 id="conquistas-lista" className="text-2xl font-semibold text-ink">
          Conquistas
        </h2>
        <p className="text-sm text-ink/55 tabular-nums">
          {unlocked} de {achievements.length}
        </p>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {achievements.map((item, index) => {
          const Icon = icons[item.id] ?? AwardIcon
          return (
            <li
              key={item.id}
              className={cn(
                'flex animate-in flex-col gap-3 rounded-3xl p-4 duration-500 fill-mode-both fade-in slide-in-from-bottom-2',
                item.unlocked ? 'bg-card ring-1 ring-border' : 'bg-secondary/50',
              )}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <span
                className={cn(
                  'relative flex size-11 items-center justify-center rounded-2xl',
                  item.unlocked ? 'bg-lime text-pine' : 'bg-card text-ink/30',
                )}
              >
                <Icon className="size-5" />
                {!item.unlocked && (
                  <LockIcon className="absolute -right-1 -bottom-1 size-4 rounded-full bg-card p-0.5 text-ink/40" />
                )}
              </span>
              <span>
                <span className={cn('block text-sm font-semibold', item.unlocked ? 'text-ink' : 'text-ink/60')}>
                  {item.title}
                </span>
                <span className="block text-xs text-ink/50">{item.description}</span>
              </span>
              {!item.unlocked && item.target > 1 && (
                <span className="mt-auto flex items-center gap-2">
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-card">
                    <span
                      className="block h-full rounded-full bg-sage"
                      style={{ width: `${(item.progress / item.target) * 100}%` }}
                    />
                  </span>
                  <span className="text-2xs font-semibold text-ink/50 tabular-nums">
                    {item.progress}/{item.target}
                  </span>
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
