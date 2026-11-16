import type { Metadata } from 'next'
import Link from 'next/link'
import { EmptyCourses } from '@/components/student/empty-courses'
import { StudentCourseCard } from '@/components/student/student-course-card'
import { StudentPageHeader } from '@/components/student/student-page-header'
import { cn } from '@/lib/utils'
import { requireUser } from '@/server/auth/session'
import { getStudentDashboard } from '@/server/services/student-dashboard'

export const metadata: Metadata = { title: 'Meus cursos' }

const filters = [
  { id: 'todos', label: 'Todos' },
  { id: 'andamento', label: 'Em andamento' },
  { id: 'concluidos', label: 'Concluídos' },
] as const

type PageProps = { searchParams: Promise<{ filtro?: string }> }

export default async function MyCoursesPage({ searchParams }: PageProps) {
  const profile = await requireUser('/aluno/cursos')
  const [{ courses }, { filtro }] = await Promise.all([getStudentDashboard(profile.id), searchParams])
  const filter = filters.find((item) => item.id === filtro)?.id ?? 'todos'
  const finished = (course: (typeof courses)[number]) => course.completedCount >= course.lessonCount
  const counts = {
    todos: courses.length,
    andamento: courses.filter((course) => !finished(course)).length,
    concluidos: courses.filter(finished).length,
  }
  const visible = courses.filter((course) =>
    filter === 'todos' ? true : filter === 'concluidos' ? finished(course) : !finished(course),
  )

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <StudentPageHeader
        eyebrow="Área do aluno"
        title="Meus cursos"
        description="Os cursos em que você está matriculado, do mais recente para o mais antigo."
      />
      {courses.length === 0 ? (
        <EmptyCourses />
      ) : (
        <>
          <nav aria-label="Filtrar cursos" className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <Link
                key={item.id}
                href={item.id === 'todos' ? '/aluno/cursos' : `/aluno/cursos?filtro=${item.id}`}
                aria-current={item.id === filter ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition',
                  item.id === filter
                    ? 'bg-pine text-paper'
                    : 'bg-card text-ink/70 ring-1 ring-ink/10 hover:text-pine dark:hover:text-lime',
                )}
              >
                {item.label}
                <span
                  className={cn(
                    'rounded-full px-2 text-xs tabular-nums',
                    item.id === filter ? 'bg-lime text-pine' : 'bg-secondary',
                  )}
                >
                  {counts[item.id]}
                </span>
              </Link>
            ))}
          </nav>
          {visible.length ? (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((course) => (
                <li key={course.id}>
                  <StudentCourseCard course={course} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-3xl bg-card p-10 text-center text-ink/65 ring-1 ring-ink/10">
              {filter === 'concluidos' ? 'Nenhum curso concluído ainda. Falta pouco!' : 'Nenhum curso em andamento.'}
            </p>
          )}
        </>
      )}
    </div>
  )
}
