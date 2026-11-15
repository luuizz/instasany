import { ArrowDownIcon, ArrowUpIcon, ListChecksIcon, PlayCircleIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { Button, ButtonLink } from '@/components/ui/button'
import {
  addLessonAction,
  addModuleAction,
  deleteModuleAction,
  moveLessonAction,
  moveModuleAction,
  renameModuleAction,
} from '@/app/(admin)/admin/cursos/actions'
import { ConfirmButton } from '@/components/ui/confirm-dialog'
import type { CourseOutline } from '@/types/lms'
import { InlineTitleForm } from './inline-title-form'

function MoveButtons({
  onUp,
  onDown,
  first,
  last,
  label,
}: {
  onUp: () => Promise<void>
  onDown: () => Promise<void>
  first: boolean
  last: boolean
  label: string
}) {
  return (
    <>
      <form action={onUp}>
        <Button type="submit" variant="ghost" size="icon-sm" disabled={first} aria-label={`Subir ${label}`}>
          <ArrowUpIcon />
        </Button>
      </form>
      <form action={onDown}>
        <Button type="submit" variant="ghost" size="icon-sm" disabled={last} aria-label={`Descer ${label}`}>
          <ArrowDownIcon />
        </Button>
      </form>
    </>
  )
}

// Módulos e aulas do curso: criar, renomear, reordenar e remover
export function CourseModules({ course }: { course: CourseOutline }) {
  return (
    <div className="flex flex-col gap-6">
      {course.modules.map((module, moduleIndex) => (
        <section
          key={module.id}
          style={{ animationDelay: `${moduleIndex * 60}ms` }}
          className="animate-in rounded-3xl border border-border bg-card p-5 duration-500 fill-mode-both fade-in slide-in-from-bottom-2"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <span className="flex size-7 items-center justify-center rounded-full bg-pine text-xs font-bold text-lime">
                {moduleIndex + 1}
              </span>
              Módulo {moduleIndex + 1} · {module.lessons.length} {module.lessons.length === 1 ? 'aula' : 'aulas'}
            </p>
            <div className="flex items-center">
              <MoveButtons
                label={`módulo ${module.title}`}
                first={moduleIndex === 0}
                last={moduleIndex === course.modules.length - 1}
                onUp={moveModuleAction.bind(null, module.id, course.id, 'up')}
                onDown={moveModuleAction.bind(null, module.id, course.id, 'down')}
              />
              <form action={deleteModuleAction.bind(null, module.id, course.id)}>
                <ConfirmButton
                  title={`Remover o módulo "${module.title}"?`}
                  description="Todas as aulas do módulo e o progresso dos alunos nelas também saem."
                  confirmLabel="Remover"
                  variant="destructive"
                  size="icon-sm"
                  aria-label={`Remover módulo ${module.title}`}
                >
                  <Trash2Icon />
                </ConfirmButton>
              </form>
            </div>
          </div>
          <div className="mt-3">
            <InlineTitleForm
              action={renameModuleAction.bind(null, module.id, course.id)}
              label="Nome do módulo"
              submitLabel="Renomear"
              defaultValue={module.title}
            />
          </div>

          <ol className="mt-4 flex flex-col gap-1">
            {module.lessons.map((lesson, lessonIndex) => (
              <li
                key={lesson.id}
                className="group flex items-center justify-between gap-3 rounded-2xl px-3 py-2 transition hover:bg-accent"
              >
                <Link
                  href={`/admin/cursos/${course.id}/aulas/${lesson.id}`}
                  className="flex min-w-0 flex-1 items-center gap-3"
                >
                  <span className="w-5 shrink-0 text-sm text-muted-foreground tabular-nums">{lessonIndex + 1}</span>
                  <span className="min-w-0 flex-1 truncate font-medium group-hover:text-pine">{lesson.title}</span>
                  <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                    {lesson.hasVideo && <PlayCircleIcon className="size-3.5 text-sage" aria-label="Com vídeo" />}
                    {lesson.releaseAfterDays > 0 && <span className="text-sage">dia {lesson.releaseAfterDays} ·</span>}
                    {lesson.durationMinutes} min
                  </span>
                </Link>
                <div className="flex shrink-0">
                  <MoveButtons
                    label={`aula ${lesson.title}`}
                    first={lessonIndex === 0}
                    last={lessonIndex === module.lessons.length - 1}
                    onUp={moveLessonAction.bind(null, lesson.id, course.id, 'up')}
                    onDown={moveLessonAction.bind(null, lesson.id, course.id, 'down')}
                  />
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-3 flex flex-wrap gap-2">
            <form action={addLessonAction.bind(null, module.id, course.id)}>
              <Button type="submit" variant="outline" size="sm" className="border-dashed">
                <PlusIcon />
                Nova aula
              </Button>
            </form>
            <ButtonLink
              href={`/admin/cursos/${course.id}/modulos/${module.id}/quiz`}
              variant={module.quizQuestions ? 'secondary' : 'outline'}
              size="sm"
              className={module.quizQuestions ? undefined : 'border-dashed'}
            >
              <ListChecksIcon />
              {module.quizQuestions
                ? `Quiz · ${module.quizQuestions} ${module.quizQuestions === 1 ? 'pergunta' : 'perguntas'}`
                : 'Criar quiz'}
            </ButtonLink>
          </div>
        </section>
      ))}

      <div className="rounded-3xl border border-dashed border-input bg-card p-5">
        <p className="mb-3 text-sm font-semibold">Novo módulo</p>
        <InlineTitleForm
          action={addModuleAction.bind(null, course.id)}
          label="Nome do módulo"
          submitLabel="Adicionar"
          resetOnSuccess
        />
      </div>
    </div>
  )
}
