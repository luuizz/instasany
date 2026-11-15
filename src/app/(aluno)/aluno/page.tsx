import Link from 'next/link'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { CourseCard } from '@/components/courses/course-card'
import { ProgressBar } from '@/components/courses/progress-bar'
import { Container } from '@/components/ui/container'
import { requireUser } from '@/server/auth/session'
import { listPublishedCourses } from '@/server/services/courses'
import { listStudentCourses } from '@/server/services/learning'

export default async function StudentHomePage() {
  const profile = await requireUser()
  const [mine, catalog] = await Promise.all([listStudentCourses(profile.id), listPublishedCourses()])
  const enrolledIds = new Set(mine.map((course) => course.id))
  const others = catalog.filter((course) => !enrolledIds.has(course.id))
  const firstName = profile.name.split(' ')[0] || 'aluno'

  return (
    <Container className="flex flex-col gap-14 py-12 sm:py-16">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-medium text-sage">Área do aluno</p>
          <h1 className="mt-2 text-4xl font-semibold text-ink">Olá, {firstName}!</h1>
        </div>
        <div className="flex items-center gap-6 text-sm">
          {profile.role === 'admin' && (
            <Link href="/admin" className="font-semibold text-pine underline-offset-4 hover:underline">
              Ir para o painel
            </Link>
          )}
          <SignOutButton className="text-ink/60" />
        </div>
      </header>

      <section>
        <h2 className="mb-6 text-2xl font-semibold text-ink">Meus cursos</h2>
        {mine.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mine.map((course) => (
              <li key={course.id}>
                <CourseCard
                  course={course}
                  href={`/aluno/cursos/${course.slug}`}
                  footer={<ProgressBar done={course.completedCount} total={course.lessonCount} />}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-3xl border border-dashed border-ink/15 p-8 text-ink/60">
            Você ainda não está em nenhum curso. Escolha um abaixo para começar.
          </p>
        )}
      </section>

      {others.length > 0 && (
        <section>
          <h2 className="mb-6 text-2xl font-semibold text-ink">
            {mine.length ? 'Outros cursos' : 'Cursos disponíveis'}
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((course) => (
              <li key={course.id}>
                <CourseCard course={course} href={`/cursos/${course.slug}`} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  )
}
