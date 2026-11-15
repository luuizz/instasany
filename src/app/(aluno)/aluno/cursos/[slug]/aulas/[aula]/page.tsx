import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LessonSidebar } from '@/components/lms/lesson-sidebar'
import { VideoPlayer } from '@/components/lms/video-player'
import { Container } from '@/components/ui/container'
import { CheckIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SubmitButton } from '@/components/ui/submit-button'
import { requireUser } from '@/server/auth/session'
import { getLessonPlayer } from '@/server/services/learning'
import { toggleLessonAction } from '../../../../actions'

type PageProps = { params: Promise<{ slug: string; aula: string }> }

export const metadata: Metadata = { title: 'Aula' }

export default async function LessonPage({ params }: PageProps) {
  const { slug, aula } = await params
  const profile = await requireUser(`/aluno/cursos/${slug}/aulas/${aula}`)
  const player = await getLessonPlayer(profile, slug, Number(aula))
  if (!player) notFound()

  const { course, lesson, completed, previousId, nextId } = player
  const isDone = completed.includes(lesson.id)
  const target = { slug, lessonId: lesson.id, nextId }
  const paragraphs = lesson.content.split(/\n\s*\n/).filter(Boolean)
  const lessonHref = (id: number) => `/aluno/cursos/${slug}/aulas/${id}`

  return (
    <Container className="grid gap-8 py-8 lg:grid-cols-[1fr_22rem] lg:py-12">
      <article className="flex min-w-0 flex-col gap-6">
        {lesson.videoUrl ? <VideoPlayer src={lesson.videoUrl} title={lesson.title} lessonId={lesson.id} /> : null}
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

        <div className="flex flex-wrap items-center gap-4 border-t border-ink/10 pt-6">
          <form action={toggleLessonAction.bind(null, target, !isDone)}>
            {isDone ? (
              <Button type="submit" variant="secondary" size="lg">
                <CheckIcon className="size-5" /> Concluída · desmarcar
              </Button>
            ) : (
              <SubmitButton>{nextId ? 'Concluir e ir para a próxima' : 'Concluir aula'}</SubmitButton>
            )}
          </form>
          <div className="ml-auto flex gap-4 text-sm font-semibold">
            {previousId && (
              <Link href={lessonHref(previousId)} className="text-ink/60 hover:text-ink">
                ← Anterior
              </Link>
            )}
            {nextId && (
              <Link href={lessonHref(nextId)} className="text-pine hover:underline">
                Próxima →
              </Link>
            )}
          </div>
        </div>
      </article>
      <aside>
        <LessonSidebar course={course} currentId={lesson.id} completed={completed} />
      </aside>
    </Container>
  )
}
