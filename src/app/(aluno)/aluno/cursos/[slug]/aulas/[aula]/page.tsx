import { isStaff } from '@/lib/roles'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LessonNotes } from '@/components/lms/lesson-notes'
import { LessonAttachments } from '@/components/lms/lesson-attachments'
import { LessonQuestions } from '@/components/questions/lesson-questions'
import { CourseAside } from '@/components/lms/course-aside'
import { VideoPlayer } from '@/components/lms/video-player'
import { formatDateTime } from '@/lib/dates'
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, LockIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SubmitButton } from '@/components/ui/submit-button'
import { requireUser } from '@/server/auth/session'
import { getLessonPlayer } from '@/server/services/learning'
import { getNote } from '@/server/services/notes'
import { listThreads } from '@/server/services/questions'
import { passedQuizModules } from '@/server/services/quiz'
import { toggleLessonAction } from '../../../../actions'

type PageProps = { params: Promise<{ slug: string; aula: string }> }

export const metadata: Metadata = { title: 'Aula' }

export default async function LessonPage({ params }: PageProps) {
  const { slug, aula } = await params
  const profile = await requireUser(`/aluno/cursos/${slug}/aulas/${aula}`)
  const player = await getLessonPlayer(profile, slug, Number(aula))
  if (!player) notFound()

  const { course, lesson, completed, previousId, nextId } = player
  const [passedQuizzes, threads, note] = await Promise.all([
    passedQuizModules(
      profile.id,
      course.modules.map((module) => module.id),
    ),
    listThreads(lesson.id, profile.id),
    getNote(profile.id, lesson.id),
  ])
  const isDone = completed.includes(lesson.id)
  const lessonModule = course.modules.find((module) => module.lessons.some((item) => item.id === lesson.id))
  // Última aula de um módulo com quiz ainda não aprovado: o próximo passo é o quiz
  const quizNext =
    lessonModule &&
    lessonModule.quizQuestions > 0 &&
    lessonModule.lessons.at(-1)?.id === lesson.id &&
    !passedQuizzes.includes(lessonModule.id)
      ? `/aluno/cursos/${slug}/quiz/${lessonModule.id}`
      : null
  const nextHref = quizNext ?? (nextId ? `/aluno/cursos/${slug}/aulas/${nextId}` : null)
  const target = { slug, lessonId: lesson.id, nextHref }
  const paragraphs = lesson.content.split(/\n\s*\n/).filter(Boolean)
  const lessonHref = (id: number) => `/aluno/cursos/${slug}/aulas/${id}`

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <article className="flex min-w-0 flex-col gap-6">
        {lesson.videoUrl ? (
          <VideoPlayer src={lesson.videoUrl} title={lesson.title} lessonId={lesson.id} startAt={player.resumeAt} />
        ) : null}
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium text-sage">{lesson.durationMinutes} min</p>
          <h1 className="text-3xl font-semibold text-ink sm:text-4xl">{lesson.title}</h1>
        </header>
        {paragraphs.length > 0 && (
          <div className="flex max-w-3xl flex-col gap-4 text-lg text-ink/80">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        )}
        <LessonAttachments items={player.attachments} />
        {player.lockedUntil && (
          <div role="status" className="flex max-w-3xl items-start gap-4 rounded-3xl bg-muted p-6">
            <LockIcon className="mt-1 size-5 shrink-0 text-sage" />
            <div>
              <p className="font-semibold text-ink">Esta aula abre em {formatDateTime(player.lockedUntil)}</p>
              <p className="mt-1 text-ink/70">
                As aulas deste curso são liberadas aos poucos depois da matrícula, para você ter tempo de aplicar cada
                uma antes da próxima.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 border-t border-ink/10 pt-6">
          <form action={toggleLessonAction.bind(null, target, !isDone)} hidden={Boolean(player.lockedUntil)}>
            {isDone ? (
              <Button type="submit" variant="secondary" size="lg">
                <CheckIcon className="size-5" /> Concluída · desmarcar
              </Button>
            ) : (
              <SubmitButton>
                {quizNext ? 'Concluir e fazer o quiz' : nextId ? 'Concluir e ir para a próxima' : 'Concluir aula'}
              </SubmitButton>
            )}
          </form>
          <div className="ml-auto flex gap-4 text-sm font-semibold">
            {previousId && (
              <Link href={lessonHref(previousId)} className="flex items-center gap-1.5 text-ink/60 hover:text-ink">
                <ArrowLeftIcon className="size-4" />
                Anterior
              </Link>
            )}
            {nextId && (
              <Link
                href={lessonHref(nextId)}
                className="flex items-center gap-1.5 text-pine hover:underline dark:text-lime"
              >
                Próxima
                <ArrowRightIcon className="size-4" />
              </Link>
            )}
          </div>
        </div>
        {!player.lockedUntil && (
          <LessonNotes
            key={lesson.id}
            lessonId={lesson.id}
            initial={note?.content ?? ''}
            savedAt={note?.updatedAt ?? null}
          />
        )}
        {!player.lockedUntil && (
          <LessonQuestions threads={threads} slug={slug} lessonId={lesson.id} isStaff={isStaff(profile.role)} />
        )}
      </article>
      <CourseAside
        course={course}
        profileId={profile.id}
        completed={completed}
        passedQuizzes={passedQuizzes}
        currentId={lesson.id}
      />
    </div>
  )
}
