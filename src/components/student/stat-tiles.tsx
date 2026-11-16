import { AwardIcon, BookOpenCheckIcon, ClockIcon, FlameIcon } from 'lucide-react'
import type { StudentDashboard } from '@/types/lms'

// Quatro números do aluno, sobre a faixa do topo
export function StatTiles({ stats }: { stats: StudentDashboard['stats'] }) {
  const tiles = [
    {
      icon: FlameIcon,
      label: 'Em andamento',
      value: stats.inProgress,
      hint: stats.inProgress === 1 ? 'curso' : 'cursos',
    },
    { icon: BookOpenCheckIcon, label: 'Aulas concluídas', value: stats.lessonsDone, hint: 'no total' },
    { icon: ClockIcon, label: 'Tempo de vídeo', value: stats.watchedMinutes, hint: 'minutos' },
    { icon: AwardIcon, label: 'Certificados', value: stats.certificates, hint: 'emitidos' },
  ]
  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map(({ icon: Icon, label, value, hint }, index) => (
        <li
          key={label}
          className="flex animate-in items-center gap-4 rounded-3xl border border-ink/10 bg-paper p-4 shadow-sm duration-500 fill-mode-both fade-in slide-in-from-bottom-2 sm:p-5"
          style={{ animationDelay: `${index * 70}ms` }}
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-pine">
            <Icon className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-2xl font-semibold text-ink tabular-nums">{value}</span>
            <span className="block truncate text-xs text-ink/60">
              {label} · {hint}
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}
