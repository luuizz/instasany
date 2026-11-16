import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { CourseCard } from '@/components/courses/course-card'
import { ContinueCard } from '@/components/student/continue-card'
import { EmptyCourses } from '@/components/student/empty-courses'
import { CertificateList, RecentList } from '@/components/student/side-lists'
import { StatTiles } from '@/components/student/stat-tiles'
import { StudentCourseCard } from '@/components/student/student-course-card'
import { StudentPageHeader } from '@/components/student/student-page-header'
import { WeekActivity } from '@/components/student/week-activity'
import { firstNameOf } from '@/lib/account'
import { requireUser } from '@/server/auth/session'
import { listCatalog } from '@/server/services/courses'
import { getStudentDashboard } from '@/server/services/student-dashboard'

export const metadata = { title: 'Início' }

// Início da área do aluno: continuar estudando, números, cursos em andamento, semana e certificados
export default async function StudentHomePage() {
  const profile = await requireUser()
  const [dashboard, catalog] = await Promise.all([getStudentDashboard(profile.id), listCatalog()])
  const enrolledIds = new Set(dashboard.courses.map((course) => course.id))
  const others = catalog.filter((course) => !enrolledIds.has(course.id)).slice(0, 3)
  const inProgress = dashboard.courses.filter((course) => course.completedCount < course.lessonCount).slice(0, 2)
  const { stats, current } = dashboard

  const summary = !dashboard.courses.length
    ? 'Escolha um curso para começar. É grátis e no seu ritmo.'
    : stats.inProgress
      ? `Você tem ${stats.inProgress} ${stats.inProgress === 1 ? 'curso' : 'cursos'} em andamento. Bora para a próxima aula?`
      : 'Você concluiu todos os seus cursos. Que tal começar um novo?'

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <StudentPageHeader
        eyebrow="Área do aluno"
        title={`Olá, ${firstNameOf(profile.name, profile.email)}!`}
        description={summary}
      />
      <StatTiles stats={stats} />

      <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex min-w-0 flex-col gap-10">
          {current ? <ContinueCard course={current} /> : <EmptyCourses />}

          {inProgress.length > 0 && (
            <section aria-labelledby="em-andamento">
              <div className="mb-5 flex items-end justify-between gap-4">
                <h2 id="em-andamento" className="text-2xl font-semibold text-ink">
                  Em andamento
                </h2>
                <Link
                  href="/aluno/cursos"
                  className="flex items-center gap-1 text-sm font-semibold text-pine hover:underline dark:text-lime"
                >
                  Meus cursos
                  <ArrowRightIcon className="size-4" />
                </Link>
              </div>
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {inProgress.map((course) => (
                  <li key={course.id}>
                    <StudentCourseCard course={course} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1">
          <WeekActivity week={dashboard.week} />
          <CertificateList courses={dashboard.courses} />
          <RecentList items={dashboard.recent} />
        </aside>
      </div>

      {others.length > 0 && (
        <section aria-labelledby="outros">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 id="outros" className="text-2xl font-semibold text-ink">
              {dashboard.courses.length ? 'Para continuar aprendendo' : 'Cursos disponíveis'}
            </h2>
            <Link
              href="/cursos"
              className="flex items-center gap-1 text-sm font-semibold text-pine hover:underline dark:text-lime"
            >
              Explorar cursos
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((course) => (
              <li key={course.id}>
                <CourseCard course={course} href={`/cursos/${course.slug}`} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
