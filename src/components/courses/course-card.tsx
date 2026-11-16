import { ArrowRightIcon, BookOpenIcon, ClockIcon, StarIcon } from 'lucide-react'
import Link from 'next/link'
import { countLabel, formatDuration } from '@/lib/duration'
import type { CourseSummary } from '@/types/lms'
import { CourseCover } from './course-cover'

type CourseCardProps = {
  course: CourseSummary & { rating?: { average: number; count: number } | null }
  href: string
  cta?: string
  footer?: React.ReactNode
}

// Card de curso: capa com o nível, título, resumo, aulas, duração e nota; o card inteiro é o link
export function CourseCard({ course, href, cta = 'Ver curso', footer }: CourseCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-card transition duration-300 hover:-translate-y-1 hover:border-sage/60 hover:shadow-xl hover:shadow-ink/10">
      <div className="relative">
        <CourseCover title={course.title} coverUrl={course.coverUrl} className="rounded-none" />
        <span className="absolute top-4 left-4 rounded-full bg-paper/95 px-3 py-1 text-xs font-semibold text-pine shadow-sm">
          {course.level}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="text-xl/snug font-semibold text-balance text-ink">
          <Link
            href={href}
            className="outline-none after:absolute after:inset-0 after:rounded-3xl focus-visible:after:ring-4 focus-visible:after:ring-ring/40"
          >
            {course.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-ink/60">{course.summary}</p>
        <p className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-sm text-ink/60">
          <span className="flex items-center gap-1.5">
            <BookOpenIcon className="size-4 text-sage" />
            {countLabel(course.lessonCount, 'aula', 'aulas')}
          </span>
          <span className="flex items-center gap-1.5">
            <ClockIcon className="size-4 text-sage" />
            {formatDuration(course.totalMinutes)}
          </span>
          {course.rating && (
            <span className="flex items-center gap-1.5">
              <StarIcon className="size-4 fill-pine text-pine dark:fill-lime dark:text-lime" />
              {course.rating.average.toFixed(1).replace('.', ',')}
              <span className="text-ink/40">({course.rating.count})</span>
            </span>
          )}
        </p>
      </div>
      {footer ? (
        <div className="relative z-10 border-t border-ink/10 px-6 py-4">{footer}</div>
      ) : (
        <div className="flex items-center justify-between border-t border-ink/10 px-6 py-4 text-sm font-semibold text-pine dark:text-lime">
          {cta}
          <ArrowRightIcon className="size-4 transition group-hover:translate-x-1" />
        </div>
      )}
    </article>
  )
}
