import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/admin/page-header'
import { ButtonLink } from '@/components/ui/button'
import { formatDuration } from '@/lib/duration'
import { listAllCourses } from '@/server/services/courses'
import { createDemoCoursesAction } from './actions'

export const metadata: Metadata = { title: 'Cursos' }

export default async function AdminCoursesPage() {
  const courses = await listAllCourses()

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="Cursos"
        description="Cursos, módulos e aulas da área do aluno."
        actions={<ButtonLink href="/admin/cursos/novo">Novo curso</ButtonLink>}
      />

      {courses.length === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded-3xl border border-dashed border-ink/20 p-8">
          <p className="text-ink/70">
            Nenhum curso ainda. Crie o primeiro ou comece com dois cursos de exemplo, já publicados.
          </p>
          <form action={createDemoCoursesAction}>
            <button
              type="submit"
              className="cursor-pointer rounded-full bg-pine px-5 py-3 font-semibold text-paper hover:bg-pine-line"
            >
              Criar cursos de exemplo
            </button>
          </form>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {courses.map((course) => (
            <li key={course.id}>
              <Link
                href={`/admin/cursos/${course.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-ink/10 p-5 transition hover:border-sage"
              >
                <div>
                  <p className="font-semibold text-ink">{course.title}</p>
                  <p className="text-sm text-ink/60">
                    {course.level} · {course.lessonCount} aulas · {formatDuration(course.totalMinutes)}
                  </p>
                </div>
                <span
                  className={
                    course.published
                      ? 'rounded-full bg-lime/40 px-3 py-1 text-xs font-bold text-pine'
                      : 'rounded-full bg-ink/10 px-3 py-1 text-xs font-bold text-ink/60'
                  }
                >
                  {course.published ? 'Publicado' : 'Rascunho'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
