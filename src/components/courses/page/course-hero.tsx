import { ArrowLeftIcon, BookOpenIcon, ClockIcon, LayersIcon, StarIcon } from 'lucide-react'
import Link from 'next/link'
import { CourseCover } from '@/components/courses/course-cover'
import { countLabel, formatDuration } from '@/lib/duration'
import type { CourseOutline, ReviewSummary } from '@/types/lms'
import { EnrollButton } from './enroll-button'

type CourseHeroProps = { course: CourseOutline; reviews: ReviewSummary; enrolled: boolean }

export function CourseHero({ course, reviews, enrolled }: CourseHeroProps) {
  const facts = [
    { icon: LayersIcon, label: countLabel(course.modules.length, 'módulo', 'módulos') },
    { icon: BookOpenIcon, label: countLabel(course.lessonCount, 'aula', 'aulas') },
    { icon: ClockIcon, label: formatDuration(course.totalMinutes) },
  ]
  return (
    <section className="relative overflow-hidden bg-pine pt-8 pb-16 lg:pt-12 lg:pb-24">
      <div aria-hidden className="absolute inset-0 opacity-50 cover-art" />
      <div className="relative mx-auto grid w-full max-w-grid items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_28rem]">
        <div className="flex flex-col gap-5">
          <Link
            href="/cursos"
            className="flex items-center gap-2 self-start text-sm font-semibold text-sage-light transition hover:text-lime"
          >
            <ArrowLeftIcon className="size-4" />
            Todos os cursos
          </Link>
          <span className="self-start rounded-full bg-lime px-3 py-1 text-xs font-semibold text-pine">
            {course.level}
          </span>
          <h1 className="text-4xl/tight font-semibold text-balance text-paper sm:text-5xl/tight">{course.title}</h1>
          <p className="max-w-2xl text-lg text-paper/70">{course.summary}</p>
          <ul className="flex flex-wrap gap-2">
            {facts.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 rounded-full bg-paper/10 px-3.5 py-2 text-sm text-paper/85"
              >
                <Icon className="size-4 text-lime" />
                {label}
              </li>
            ))}
            {reviews.count > 0 && (
              <li>
                <a
                  href="#avaliacoes"
                  className="flex items-center gap-2 rounded-full bg-paper/10 px-3.5 py-2 text-sm text-paper/85 transition hover:bg-paper/15"
                >
                  <StarIcon className="size-4 fill-lime text-lime" />
                  {reviews.average.toFixed(1).replace('.', ',')} ({reviews.count})
                </a>
              </li>
            )}
          </ul>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-3">
            <EnrollButton slug={course.slug} enrolled={enrolled} />
            {!enrolled && <p className="text-sm text-paper/60">Grátis, sem cartão. Certificado incluso.</p>}
          </div>
        </div>
        <CourseCover
          title={course.title}
          coverUrl={course.coverUrl}
          className="shadow-2xl ring-1 shadow-ink/50 ring-paper/10"
        />
      </div>
    </section>
  )
}
