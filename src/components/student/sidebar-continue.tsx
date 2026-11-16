import { PlayIcon } from 'lucide-react'
import Link from 'next/link'

export type SidebarCourse = { title: string; href: string; percent: number; nextLessonTitle: string | null }

// Atalho para o curso em andamento no rodapé do menu lateral
export function SidebarContinue({ course }: { course: SidebarCourse }) {
  return (
    <Link
      href={course.href}
      className="group flex flex-col gap-3 rounded-2xl bg-pine-line/60 p-4 transition hover:bg-pine-line"
    >
      <span className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-lime text-pine transition group-hover:scale-105">
          <PlayIcon className="ml-0.5 size-4 fill-pine" />
        </span>
        <span className="min-w-0">
          <span className="block text-xs text-paper/50">Continuar</span>
          <span className="block truncate text-sm font-semibold text-paper">
            {course.nextLessonTitle ?? course.title}
          </span>
        </span>
      </span>
      <span className="flex items-center gap-2">
        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-night/30">
          <span className="block h-full rounded-full bg-lime" style={{ width: `${course.percent}%` }} />
        </span>
        <span className="text-xs font-semibold text-paper/70 tabular-nums">{course.percent}%</span>
      </span>
    </Link>
  )
}
