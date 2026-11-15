import Link from 'next/link'
import { ProgressBar } from '@/components/courses/progress-bar'
import { CheckIcon, ListChecksIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CourseOutline } from '@/types/lms'

type LessonSidebarProps = {
  course: CourseOutline
  completed: number[]
  // Módulos com quiz aprovado; currentQuiz = módulo do quiz aberto
  passedQuizzes?: number[]
  currentId?: number
  currentQuiz?: number
}

// Lista de módulos e aulas ao lado do player, com o que já foi concluído
export function LessonSidebar({ course, currentId, completed, passedQuizzes = [], currentQuiz }: LessonSidebarProps) {
  const done = new Set(completed)
  const passed = new Set(passedQuizzes)

  return (
    <nav aria-label="Aulas do curso" className="flex flex-col gap-6 rounded-3xl border border-ink/10 p-5">
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
            {module.quizQuestions > 0 && (
              <li>
                <Link
                  href={`/aluno/cursos/${course.slug}/quiz/${module.id}`}
                  aria-current={currentQuiz === module.id ? 'page' : undefined}
                  className={cn(
                    'flex items-start gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition',
                    currentQuiz === module.id ? 'bg-pine text-paper' : 'text-pine hover:bg-ink/5',
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full',
                      passed.has(module.id) ? 'bg-sage text-paper' : 'text-current',
                    )}
                  >
                    {passed.has(module.id) ? <CheckIcon className="size-3" /> : <ListChecksIcon className="size-4" />}
                  </span>
                  <span className="flex-1">Quiz do módulo</span>
                  <span className="sr-only">{passed.has(module.id) ? 'Aprovado' : 'Pendente'}</span>
                </Link>
              </li>
            )}
          </ol>
        </div>
      ))}
    </nav>
  )
}
