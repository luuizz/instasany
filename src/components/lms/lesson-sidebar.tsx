import Link from 'next/link'
import { ProgressBar } from '@/components/courses/progress-bar'
import { CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CourseOutline } from '@/types/lms'

type LessonSidebarProps = { course: CourseOutline; currentId: number; completed: number[] }

// Lista de módulos e aulas ao lado do player, com o que já foi concluído
export function LessonSidebar({ course, currentId, completed }: LessonSidebarProps) {
  const done = new Set(completed)

  return (
    <nav
      aria-label="Aulas do curso"
      className="flex flex-col gap-6 rounded-3xl border border-ink/10 p-5 lg:sticky lg:top-6"
    >
      <div className="flex flex-col gap-3">
        <Link href={`/cursos/${course.slug}`} className="font-semibold text-ink hover:underline">
          {course.title}
        </Link>
        <ProgressBar done={done.size} total={course.lessonCount} />
      </div>
      {course.modules.map((module, moduleIndex) => (
        <div key={module.id}>
          <p className="mb-2 text-xs font-bold tracking-wide text-sage uppercase">
            Módulo {moduleIndex + 1} · {module.title}
          </p>
          <ol className="flex flex-col gap-1">
            {module.lessons.map((lesson) => {
              const current = lesson.id === currentId
              return (
                <li key={lesson.id}>
                  <Link
                    href={`/aluno/cursos/${course.slug}/aulas/${lesson.id}`}
                    aria-current={current ? 'page' : undefined}
                    className={cn(
                      'flex items-start gap-3 rounded-2xl px-3 py-2 text-sm transition',
                      current ? 'bg-pine text-paper' : 'text-ink/70 hover:bg-ink/5',
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border',
                        done.has(lesson.id)
                          ? 'border-sage bg-sage text-paper'
                          : current
                            ? 'border-paper/40'
                            : 'border-ink/20',
                      )}
                    >
                      {done.has(lesson.id) && <CheckIcon className="size-3" />}
                      <span className="sr-only">{done.has(lesson.id) ? 'Concluída' : 'Pendente'}</span>
                    </span>
                    <span className="flex-1">{lesson.title}</span>
                    <span className={cn('shrink-0 text-xs', current ? 'text-paper/60' : 'text-ink/40')}>
                      {lesson.durationMinutes} min
                    </span>
                  </Link>
                </li>
              )
            })}
          </ol>
        </div>
      ))}
    </nav>
  )
}
