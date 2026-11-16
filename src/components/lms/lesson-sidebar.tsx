import Link from 'next/link'
import { ProgressBar } from '@/components/courses/progress-bar'
import { CheckIcon, ListChecksIcon, LockIcon } from 'lucide-react'
import { isReleased, releaseDate } from '@/lib/release'
import { cn } from '@/lib/utils'
import type { CourseOutline } from '@/types/lms'

type LessonSidebarProps = {
  course: CourseOutline
  completed: number[]
  // Módulos com quiz aprovado; currentQuiz = módulo do quiz aberto
  passedQuizzes?: number[]
  currentId?: number
  currentQuiz?: number
  // Matrícula, para mostrar quando abrem as aulas de liberação gradual (null = tudo aberto)
  enrolledAt?: Date | null
}

const shortDate = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo' })

// Lista de módulos e aulas ao lado do player, com o que já foi concluído
export function LessonSidebar({
  course,
  currentId,
  completed,
  passedQuizzes = [],
  currentQuiz,
  enrolledAt = null,
}: LessonSidebarProps) {
  const done = new Set(completed)
  const passed = new Set(passedQuizzes)

  return (
    <nav aria-label="Aulas do curso" className="flex flex-col gap-6 rounded-3xl border border-ink/10 p-5">
      <div className="flex flex-col gap-3">
        <Link href={`/aluno/explorar/${course.slug}`} className="font-semibold text-ink hover:underline">
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
              const locked = !isReleased(enrolledAt, lesson.releaseAfterDays)
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
                      {locked && <LockIcon className="size-3" />}
                      <span className="sr-only">
                        {done.has(lesson.id) ? 'Concluída' : locked ? 'Ainda não liberada' : 'Pendente'}
                      </span>
                    </span>
                    <span className={cn('flex-1', locked && !current && 'text-ink/65')}>{lesson.title}</span>
                    <span className={cn('shrink-0 text-xs', current ? 'text-paper/60' : 'text-ink/65')}>
                      {locked && enrolledAt
                        ? `abre ${shortDate.format(releaseDate(enrolledAt, lesson.releaseAfterDays))}`
                        : `${lesson.durationMinutes} min`}
                    </span>
                  </Link>
                </li>
              )
            })}
            {module.quizQuestions > 0 &&
              module.lessons.some((lesson) => !isReleased(enrolledAt, lesson.releaseAfterDays)) && (
                <li className="flex items-start gap-3 px-3 py-2 text-sm text-ink/65">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center">
                    <LockIcon className="size-3.5" />
                  </span>
                  <span className="flex-1">Quiz do módulo</span>
                  <span className="text-xs">depois das aulas</span>
                </li>
              )}
            {module.quizQuestions > 0 &&
              module.lessons.every((lesson) => isReleased(enrolledAt, lesson.releaseAfterDays)) && (
                <li>
                  <Link
                    href={`/aluno/cursos/${course.slug}/quiz/${module.id}`}
                    aria-current={currentQuiz === module.id ? 'page' : undefined}
                    className={cn(
                      'flex items-start gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition',
                      currentQuiz === module.id ? 'bg-pine text-paper' : 'text-pine hover:bg-ink/5 dark:text-lime',
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
