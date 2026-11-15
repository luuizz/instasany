import Link from 'next/link'
import {
  addLessonAction,
  addModuleAction,
  deleteModuleAction,
  moveLessonAction,
  moveModuleAction,
  renameModuleAction,
} from '@/app/(admin)/admin/cursos/actions'
import { ConfirmButton } from '@/components/ui/confirm-button'
import type { CourseOutline } from '@/types/lms'
import { InlineTitleForm } from './inline-title-form'

const iconButton =
  'cursor-pointer rounded-full px-3 py-1 text-xs font-semibold hover:bg-ink/5 disabled:cursor-default disabled:opacity-30'

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
        <button type="submit" className={iconButton} disabled={first} aria-label={`Subir ${label}`}>
          ↑
        </button>
      </form>
      <form action={onDown}>
        <button type="submit" className={iconButton} disabled={last} aria-label={`Descer ${label}`}>
          ↓
        </button>
      </form>
    </>
  )
}

// Módulos e aulas do curso: criar, renomear, reordenar e remover
export function CourseModules({ course }: { course: CourseOutline }) {
  return (
    <div className="flex flex-col gap-6">
      {course.modules.map((module, moduleIndex) => (
        <section key={module.id} className="rounded-3xl border border-ink/10 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-ink/50">Módulo {moduleIndex + 1}</p>
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
                  message={`Remover o módulo "${module.title}" e todas as aulas dele?`}
                  className={`${iconButton} text-red-700`}
                >
                  Remover
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

          <ol className="mt-4 flex flex-col divide-y divide-ink/10">
            {module.lessons.map((lesson, lessonIndex) => (
              <li key={lesson.id} className="flex items-center justify-between gap-3 py-3">
                <Link href={`/admin/cursos/${course.id}/aulas/${lesson.id}`} className="min-w-0 flex-1 hover:underline">
                  <span className="text-ink/40">{lessonIndex + 1}.</span> {lesson.title}
                  <span className="ml-2 text-xs text-ink/50">
                    {lesson.durationMinutes} min{lesson.hasVideo ? ' · vídeo' : ''}
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
          <form action={addLessonAction.bind(null, module.id, course.id)} className="mt-3">
            <button
              type="submit"
              className="cursor-pointer rounded-full border border-dashed border-ink/30 px-4 py-2 text-sm font-semibold hover:border-sage"
            >
              + Nova aula
            </button>
          </form>
        </section>
      ))}

      <div className="rounded-3xl bg-sage-light/10 p-5">
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
