import { ArrowLeftIcon, BookOpenIcon, ClockIcon, LayersIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CourseCover } from '@/components/courses/course-cover'
import { CourseSyllabus } from '@/components/courses/course-syllabus'
import { CourseHighlights } from '@/components/courses/page/course-highlights'
import { CourseIncludes } from '@/components/courses/page/course-includes'
import { EnrollButton } from '@/components/courses/page/enroll-button'
import { countLabel, formatDuration } from '@/lib/duration'
import { requireUser } from '@/server/auth/session'
import { getPublishedCourse } from '@/server/services/courses'
import { isEnrolled } from '@/server/services/learning'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const course = await getPublishedCourse((await params).slug)
  return { title: course?.title ?? 'Curso' }
}

// Prévia do curso dentro da área do aluno, com a matrícula sem sair dela
export default async function ExploreCoursePage({ params }: PageProps) {
  const { slug } = await params
  const profile = await requireUser(`/aluno/explorar/${slug}`)
  const course = await getPublishedCourse(slug)
  if (!course) notFound()
  const enrolled = await isEnrolled(profile.id, course.id)
  const facts = [
    { icon: LayersIcon, label: countLabel(course.modules.length, 'módulo', 'módulos') },
    { icon: BookOpenIcon, label: countLabel(course.lessonCount, 'aula', 'aulas') },
    { icon: ClockIcon, label: formatDuration(course.totalMinutes) },
  ]

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
      <Link
        href="/aluno/explorar"
        className="flex items-center gap-2 self-start text-sm font-semibold text-ink/60 transition hover:text-ink"
      >
        <ArrowLeftIcon className="size-4" />
        Explorar cursos
      </Link>

      <section className="grid items-center gap-8 rounded-3xl bg-card p-6 ring-1 ring-border sm:p-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex flex-col gap-4">
          <span className="self-start rounded-full bg-lime px-3 py-1 text-xs font-semibold text-pine">
            {course.level}
          </span>
          <h1 className="text-3xl font-semibold text-balance text-ink sm:text-4xl">{course.title}</h1>
          <p className="text-lg text-ink/65">{course.summary}</p>
          <ul className="flex flex-wrap gap-2">
            {facts.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 rounded-full bg-secondary px-3.5 py-2 text-sm text-ink/80"
              >
                <Icon className="size-4 text-sage" />
                {label}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-2">
            <EnrollButton slug={course.slug} enrolled={enrolled} />
            {!enrolled && <p className="text-sm text-ink/55">Grátis. Você começa pela primeira aula.</p>}
          </div>
        </div>
        <CourseCover title={course.title} coverUrl={course.coverUrl} />
      </section>

      <CourseHighlights modules={course.modules} />
      <section aria-labelledby="conteudo">
        <h2 id="conteudo" className="mb-6 text-2xl font-semibold text-ink">
          Conteúdo do curso
        </h2>
        <CourseSyllabus modules={course.modules} />
      </section>
      <CourseIncludes course={course} />
    </div>
  )
}
