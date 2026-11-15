import { countLabel, formatDuration } from '@/lib/duration'
import type { ModuleItem } from '@/types/lms'

// Ementa: módulos e aulas, com duração e indicação de vídeo
export function CourseSyllabus({ modules }: { modules: ModuleItem[] }) {
  return (
    <div className="flex flex-col gap-3">
      {modules.map((module, index) => (
        <details key={module.id} open={index === 0} className="group rounded-3xl border border-ink/10 px-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 [&::-webkit-details-marker]:hidden">
            <span>
              <span className="block text-sm text-sage">Módulo {index + 1}</span>
              <span className="font-semibold text-ink">{module.title}</span>
            </span>
            <span className="text-sm text-ink/50">
              {countLabel(module.lessons.length, 'aula', 'aulas')} ·{' '}
              {formatDuration(module.lessons.reduce((total, lesson) => total + lesson.durationMinutes, 0))}
            </span>
          </summary>
          <ol className="flex flex-col gap-3 pb-5">
            {module.lessons.map((lesson) => (
              <li key={lesson.id} className="flex items-center justify-between gap-4 text-ink/70">
                <span>{lesson.title}</span>
                <span className="shrink-0 text-xs text-ink/50">
                  {lesson.hasVideo ? 'vídeo · ' : ''}
                  {lesson.durationMinutes} min
                </span>
              </li>
            ))}
          </ol>
        </details>
      ))}
    </div>
  )
}
