import Link from 'next/link'
import { formatDuration } from '@/lib/duration'
import type { CourseSummary } from '@/types/lms'
import { CourseCover } from './course-cover'

type CourseCardProps = { course: CourseSummary; href: string; footer?: React.ReactNode }

export function CourseCard({ course, href, footer }: CourseCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-paper transition hover:border-sage hover:shadow-xl">
      <Link href={href} className="flex flex-1 flex-col">
        <CourseCover title={course.title} coverUrl={course.coverUrl} className="rounded-none" />
        <div className="flex flex-1 flex-col gap-2 p-6">
          <p className="text-sm font-medium text-sage">
            {course.level} · {course.lessonCount} aulas · {formatDuration(course.totalMinutes)}
          </p>
          <h3 className="text-xl font-semibold text-ink group-hover:underline">{course.title}</h3>
          <p className="text-ink/60">{course.summary}</p>
        </div>
      </Link>
      {footer && <div className="px-6 pb-6">{footer}</div>}
    </article>
  )
}
