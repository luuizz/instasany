import { CheckIcon } from 'lucide-react'
import type { ModuleItem } from '@/types/lms'

// "O que você vai aprender": um item por módulo, com as primeiras aulas como detalhe
export function CourseHighlights({ modules }: { modules: ModuleItem[] }) {
  if (!modules.length) return null
  return (
    <section aria-labelledby="aprender" className="rounded-3xl bg-secondary p-6 sm:p-8">
      <h2 id="aprender" className="text-2xl font-semibold text-ink">
        O que você vai aprender
      </h2>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2">
        {modules.map((module) => (
          <li key={module.id} className="flex gap-3">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-pine text-lime">
              <CheckIcon className="size-3.5" strokeWidth={3} />
            </span>
            <span>
              <span className="block font-semibold text-ink">{module.title}</span>
              <span className="mt-1 line-clamp-2 block text-sm text-ink/60">
                {module.lessons
                  .slice(0, 3)
                  .map((lesson) => lesson.title)
                  .join(' · ')}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
