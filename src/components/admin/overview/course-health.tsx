import { ChartColumnIcon } from 'lucide-react'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import type { CourseHealth } from '@/server/services/dashboard'

// Cada curso com matriculados e conclusão, levando ao relatório completo
export function CourseHealthList({ courses }: { courses: CourseHealth[] }) {
  return (
    <section aria-labelledby="cursos-saude" className="rounded-3xl border border-border bg-card p-6">
      <h2 id="cursos-saude" className="text-lg font-semibold">
        Cursos
      </h2>
      <ul className="mt-4 flex flex-col divide-y divide-border">
        {courses.map((course) => {
          const percent = course.enrolled ? Math.round((course.finished / course.enrolled) * 100) : 0
          return (
            <li key={course.id}>
              <Link
                href={`/admin/cursos/${course.id}/relatorio`}
                className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 py-3"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium group-hover:underline">{course.title}</span>
                  <span className="block text-xs text-muted-foreground">
                    {course.published ? `${course.enrolled} matriculados · ${course.finished} concluíram` : 'Rascunho'}
                  </span>
                </span>
                <ChartColumnIcon className="size-4 text-muted-foreground transition group-hover:text-pine" />
                {course.published && (
                  <span className="col-span-2 flex items-center gap-3">
                    <Progress value={percent} className="h-1.5" aria-label={`${percent}% concluíram`} />
                    <span className="w-10 text-right text-xs tabular-nums">{percent}%</span>
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
