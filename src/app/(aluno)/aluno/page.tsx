import { AwardIcon, CompassIcon, LayoutDashboardIcon, UserRoundIcon } from 'lucide-react'
import Link from 'next/link'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { CourseCard } from '@/components/courses/course-card'
import { ProgressBar } from '@/components/courses/progress-bar'
import { ContinueCard } from '@/components/student/continue-card'
import { CertificateList, RecentList } from '@/components/student/side-lists'
import { StatTiles } from '@/components/student/stat-tiles'
import { WeekActivity } from '@/components/student/week-activity'
import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { firstNameOf } from '@/lib/account'
import { isStaff } from '@/lib/roles'
import { requireUser } from '@/server/auth/session'
import { listCatalog } from '@/server/services/courses'
import { getStudentDashboard } from '@/server/services/student-dashboard'

// Dashboard do aluno: continuar estudando, números, cursos, semana e certificados
export default async function StudentHomePage() {
  const profile = await requireUser()
  const [dashboard, catalog] = await Promise.all([getStudentDashboard(profile.id), listCatalog()])
  const enrolledIds = new Set(dashboard.courses.map((course) => course.id))
  const others = catalog.filter((course) => !enrolledIds.has(course.id))
  const firstName = firstNameOf(profile.name, profile.email)
  const { stats, current } = dashboard

  const summary = !dashboard.courses.length
    ? 'Escolha um curso para começar. É grátis e no seu ritmo.'
    : stats.inProgress
      ? `Você tem ${stats.inProgress} ${stats.inProgress === 1 ? 'curso' : 'cursos'} em andamento. Bora para a próxima aula?`
      : 'Você concluiu todos os seus cursos. Que tal começar um novo?'

  return (
    <>
      <section className="relative overflow-hidden bg-pine pt-10 pb-20 sm:pt-12">
        <div aria-hidden className="absolute inset-0 opacity-60 cover-art" />
        <Container className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-lime">Área do aluno</p>
            <h1 className="mt-2 text-3xl font-semibold text-paper sm:text-4xl">Olá, {firstName}!</h1>
            <p className="mt-2 max-w-xl text-paper/70">{summary}</p>
          </div>
          <nav aria-label="Conta" className="flex flex-wrap items-center gap-2 text-sm">
            {isStaff(profile.role) && (
              <Link
                href="/admin"
                className="flex items-center gap-2 rounded-full bg-paper/10 px-4 py-2 font-medium text-paper transition hover:bg-paper/20"
              >
                <LayoutDashboardIcon className="size-4" />
                Painel
              </Link>
            )}
            <Link
              href="/aluno/perfil"
              className="flex items-center gap-2 rounded-full bg-paper/10 px-4 py-2 font-medium text-paper transition hover:bg-paper/20"
            >
              <UserRoundIcon className="size-4" />
              Meu perfil
            </Link>
            <SignOutButton className="px-3 text-paper/70 hover:text-paper" />
          </nav>
        </Container>
      </section>

      <Container className="relative -mt-12 flex flex-col gap-10 pb-16">
        <StatTiles stats={stats} />

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="flex min-w-0 flex-col gap-10">
            {current ? (
              <ContinueCard course={current} />
            ) : (
              <section className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-ink/15 px-6 py-14 text-center">
                <CompassIcon className="size-10 text-sage" />
                <h2 className="text-2xl font-semibold text-ink">Seu primeiro curso está a um clique</h2>
                <p className="max-w-md text-ink/60">
                  Os cursos são gratuitos. Matricule-se e a sua jornada aparece aqui, com progresso e certificado.
                </p>
                <ButtonLink href="/cursos" size="default">
                  Ver os cursos
                </ButtonLink>
              </section>
            )}

            {dashboard.courses.length > 0 && (
              <section aria-labelledby="meus-cursos">
                <h2 id="meus-cursos" className="mb-5 text-2xl font-semibold text-ink">
                  Meus cursos
                </h2>
                <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {dashboard.courses.map((course) => (
                    <li key={course.id}>
                      <CourseCard
                        course={course}
                        href={`/aluno/cursos/${course.slug}`}
                        footer={
                          <div className="flex flex-col gap-3">
                            <ProgressBar done={course.completedCount} total={course.lessonCount} />
                            {course.certificateCode ? (
                              <Link
                                href={`/certificado/${course.certificateCode}`}
                                className="flex items-center gap-2 text-sm font-semibold text-pine hover:underline"
                              >
                                <AwardIcon className="size-4 text-sage" />
                                Ver certificado
                              </Link>
                            ) : (
                              <p className="text-sm text-ink/50">
                                {course.completedCount >= course.lessonCount
                                  ? 'Aulas concluídas: falta emitir o certificado na aula.'
                                  : course.nextLessonTitle
                                    ? `Próxima: ${course.nextLessonTitle}`
                                    : 'Comece pela primeira aula.'}
                              </p>
                            )}
                          </div>
                        }
                      />
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="flex flex-col gap-6">
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
              <Link href="/cursos" className="text-sm font-semibold text-pine hover:underline">
                Ver todos
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
      </Container>
    </>
  )
}
