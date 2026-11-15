import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CourseCover } from '@/components/courses/course-cover'
import { CourseSyllabus } from '@/components/courses/course-syllabus'
import { Container } from '@/components/ui/container'
import { SubmitButton } from '@/components/ui/submit-button'
import { countLabel, formatDuration } from '@/lib/duration'
import { getCurrentProfile } from '@/server/auth/session'
import { getPublishedCourse } from '@/server/services/courses'
import { isEnrolled } from '@/server/services/learning'
import { enrollAction } from '../actions'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const course = await getPublishedCourse((await params).slug)
  return course ? { title: course.title, description: course.summary } : {}
}

export default async function CoursePage({ params }: PageProps) {
  const course = await getPublishedCourse((await params).slug)
  if (!course) notFound()
  const profile = await getCurrentProfile().catch(() => null)
  const enrolled = profile ? await isEnrolled(profile.id, course.id) : false
  const paragraphs = course.description.split(/\n\s*\n/).filter(Boolean)

  return (
    <>
      <section className="border-t border-pine-line bg-pine py-12 lg:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-[1fr_28rem]">
          <div className="flex flex-col gap-5">
            <Link href="/cursos" className="text-sm font-semibold text-sage hover:text-lime">
              ← Todos os cursos
            </Link>
            <h1 className="text-4xl/tight font-semibold text-balance text-paper sm:text-5xl/tight">{course.title}</h1>
            <p className="text-lg text-paper/70">{course.summary}</p>
            <p className="text-sm font-medium text-sage-light">
              {course.level} · {countLabel(course.modules.length, 'módulo', 'módulos')} ·{' '}
              {countLabel(course.lessonCount, 'aula', 'aulas')} · {formatDuration(course.totalMinutes)}
            </p>
            <div className="pt-2">
              {enrolled ? (
                <Link
                  href={`/aluno/cursos/${course.slug}`}
                  className="inline-flex rounded-full bg-lime px-6 py-4 font-bold text-pine hover:brightness-95"
                >
                  Continuar curso
                </Link>
              ) : (
                <form action={enrollAction.bind(null, course.slug)}>
                  <SubmitButton>Matricular-se grátis</SubmitButton>
                </form>
              )}
            </div>
          </div>
          <CourseCover title={course.title} coverUrl={course.coverUrl} className="shadow-2xl shadow-ink/40" />
        </Container>
      </section>

      <Container className="grid gap-12 py-16 lg:grid-cols-[1fr_32rem] lg:py-24">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-ink">Sobre o curso</h2>
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-lg text-ink/70">
              {paragraph}
            </p>
          ))}
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-ink">Conteúdo</h2>
          <CourseSyllabus modules={course.modules} />
        </div>
      </Container>
    </>
  )
}
