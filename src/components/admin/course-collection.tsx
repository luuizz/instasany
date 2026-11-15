import Link from 'next/link'
import { CourseCover } from '@/components/courses/course-cover'
import { ChevronRightIcon } from 'lucide-react'
import type { AdminView } from '@/lib/admin-view'
import { countLabel, formatDuration } from '@/lib/duration'
import type { CourseSummary } from '@/types/lms'
import { StatusBadge } from './status-badge'

type CourseCollectionProps = { courses: CourseSummary[]; view: AdminView }

const href = (course: CourseSummary) => `/admin/cursos/${course.id}`
const stats = (course: CourseSummary) =>
  `${countLabel(course.lessonCount, 'aula', 'aulas')} · ${formatDuration(course.totalMinutes)}`
const status = (course: CourseSummary, onImage = false) => (
  <StatusBadge tone={course.published ? 'live' : 'muted'} onImage={onImage}>
    {course.published ? 'Publicado' : 'Rascunho'}
  </StatusBadge>
)

// Cursos do painel em grade (cards com capa) ou lista (linhas compactas)
export function CourseCollection({ courses, view }: CourseCollectionProps) {
  if (view === 'grade') {
    return (
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {courses.map((course, index) => (
          <li
            key={course.id}
            style={{ animationDelay: `${index * 50}ms` }}
            className="animate-in duration-500 fill-mode-both fade-in slide-in-from-bottom-3"
          >
            <Link
              href={href(course)}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition duration-300 hover:-translate-y-1 hover:border-sage hover:shadow-xl"
            >
              <div className="relative">
                <CourseCover title={course.title} coverUrl={course.coverUrl} className="rounded-none" />
                <div className="absolute top-4 left-4">{status(course, true)}</div>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <p className="text-sm font-medium text-sage">{course.level}</p>
                <h2 className="text-lg font-semibold text-ink group-hover:underline">{course.title}</h2>
                <p className="line-clamp-2 text-sm text-ink/60">{course.summary}</p>
                <p className="mt-auto flex items-center justify-between pt-3 text-sm text-ink/50">
                  {stats(course)}
                  <ChevronRightIcon className="size-4 text-ink/30 transition group-hover:translate-x-0.5 group-hover:text-pine" />
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="animate-in overflow-hidden rounded-3xl border border-border bg-card duration-500 fade-in slide-in-from-bottom-2">
      <div className="hidden grid-cols-[minmax(0,1fr)_8rem_6rem_6rem_7rem] gap-4 border-b border-ink/10 bg-ink/3 px-5 py-3 text-xs font-bold tracking-wide text-ink/50 uppercase lg:grid">
        <span>Curso</span>
        <span>Nível</span>
        <span>Aulas</span>
        <span>Duração</span>
        <span>Status</span>
      </div>
      <ul className="divide-y divide-ink/10">
        {courses.map((course) => (
          <li key={course.id}>
            <Link
              href={href(course)}
              className="group grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-4 px-5 py-4 transition hover:bg-sage-light/10 sm:grid-cols-[5rem_minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1fr)_8rem_6rem_6rem_7rem]"
            >
              <span className="contents lg:flex lg:min-w-0 lg:items-center lg:gap-4">
                <CourseCover
                  title={course.title}
                  coverUrl={course.coverUrl}
                  compact
                  className="w-20 shrink-0 rounded-xl"
                />
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-ink group-hover:underline">{course.title}</span>
                  <span className="block truncate text-sm text-ink/50">
                    <span className="lg:hidden">
                      <span className="sm:hidden">{course.published ? 'Publicado' : 'Rascunho'} · </span>
                      {course.level} · {stats(course)}
                    </span>
                    <span className="hidden lg:inline">{course.summary}</span>
                  </span>
                </span>
              </span>
              <span className="hidden text-sm text-ink/70 lg:block">{course.level}</span>
              <span className="hidden text-sm text-ink/70 lg:block">{course.lessonCount}</span>
              <span className="hidden text-sm text-ink/70 lg:block">{formatDuration(course.totalMinutes)}</span>
              <span className="hidden sm:block">{status(course)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
