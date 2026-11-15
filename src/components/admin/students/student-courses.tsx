import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import { formatDate, formatRelative } from '@/lib/dates'
import type { StudentCourseProgress } from '@/types/students'

export function StudentCourses({ courses }: { courses: StudentCourseProgress[] }) {
  if (courses.length === 0) {
    return (
      <p className="rounded-2xl bg-muted p-6 text-sm text-muted-foreground">Ainda não se matriculou em nenhum curso.</p>
    )
  }
  return (
    <ul className="flex flex-col gap-3">
      {courses.map((course) => {
        const value = course.total ? Math.round((course.completed / course.total) * 100) : 0
        return (
          <li key={course.id} className="rounded-2xl border border-border p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <Link href={`/admin/cursos/${course.id}`} className="font-semibold text-ink hover:underline">
                {course.title}
              </Link>
              <span className="text-sm text-muted-foreground tabular-nums">
                {course.completed} de {course.total} aulas
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Progress value={value} aria-label={`${value}% concluído`} className="h-2" />
              <span className="w-10 text-right text-sm font-medium tabular-nums">{value}%</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {course.enrolledAt && `Matrícula em ${formatDate(course.enrolledAt)}`}
              {course.lastCompletedAt && ` · última aula concluída ${formatRelative(course.lastCompletedAt)}`}
            </p>
            {course.certificateCode && (
              <Link
                href={`/certificado/${course.certificateCode}`}
                target="_blank"
                className="mt-2 inline-block text-xs font-semibold text-pine hover:underline"
              >
                Certificado {course.certificateCode}
              </Link>
            )}
          </li>
        )
      })}
    </ul>
  )
}
