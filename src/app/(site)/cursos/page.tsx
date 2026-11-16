import { AwardIcon, BookOpenIcon, ClockIcon, GraduationCapIcon, PlayCircleIcon, UserPlusIcon } from 'lucide-react'
import type { Metadata } from 'next'
import { CourseCatalog } from '@/components/courses/course-catalog'
import { Container } from '@/components/ui/container'
import { formatDuration } from '@/lib/duration'
import { listCatalog } from '@/server/services/courses'

export const metadata: Metadata = {
  title: 'Cursos',
  description: 'Cursos online e gratuitos para criar, crescer e monetizar seu perfil no Instagram.',
}

const steps = [
  { icon: UserPlusIcon, title: 'Crie sua conta grátis', text: 'Matricule-se em um clique, sem cartão.' },
  { icon: PlayCircleIcon, title: 'Estude no seu ritmo', text: 'Aulas curtas; o vídeo volta de onde você parou.' },
  { icon: AwardIcon, title: 'Ganhe o certificado', text: 'Conclua as aulas e os quizzes e compartilhe no LinkedIn.' },
]

export default async function CoursesPage() {
  const courses = await listCatalog()
  const lessons = courses.reduce((total, course) => total + course.lessonCount, 0)
  const minutes = courses.reduce((total, course) => total + course.totalMinutes, 0)
  const stats = [
    { icon: GraduationCapIcon, label: `${courses.length} ${courses.length === 1 ? 'curso' : 'cursos'}` },
    { icon: BookOpenIcon, label: `${lessons} aulas` },
    { icon: ClockIcon, label: `${formatDuration(minutes)} de conteúdo` },
    { icon: AwardIcon, label: 'Certificado grátis' },
  ]

  return (
    <>
      <section className="relative overflow-hidden bg-pine py-14 lg:py-20">
        <div aria-hidden className="absolute inset-0 opacity-70 cover-art" />
        <Container className="relative flex flex-col items-center gap-5 text-center">
          <p className="rounded-full border border-pine-line bg-ink/25 px-4 py-1.5 text-sm font-medium text-lime">
            Cursos gratuitos
          </p>
          <h1 className="max-w-3xl text-4xl/tight font-semibold text-balance text-paper sm:text-5xl/tight">
            Aprenda a crescer no Instagram, no seu ritmo
          </h1>
          <p className="max-w-xl text-lg text-paper/70">
            Aulas curtas e práticas, do primeiro post ao primeiro cliente. Comece hoje, de casa.
          </p>
          {courses.length > 0 && (
            <ul className="mt-2 flex flex-wrap justify-center gap-2">
              {stats.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 rounded-full bg-paper/10 px-4 py-2 text-sm text-paper/90"
                >
                  <Icon className="size-4 text-lime" />
                  {label}
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <Container className="py-12 lg:py-16">
        {courses.length ? (
          <CourseCatalog courses={courses} />
        ) : (
          <p className="py-16 text-center text-ink/60">Os cursos estão chegando. Volte em breve!</p>
        )}
      </Container>

      <section aria-labelledby="como-funciona" className="border-t border-ink/10 bg-muted/60 py-12 lg:py-16">
        <Container>
          <h2 id="como-funciona" className="text-center text-2xl font-semibold text-ink sm:text-3xl">
            Como funciona
          </h2>
          <ol className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <li key={title} className="flex gap-4 rounded-3xl bg-paper p-6">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-pine text-lime">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-wider text-sage uppercase">Passo {index + 1}</p>
                  <p className="mt-1 font-semibold text-ink">{title}</p>
                  <p className="mt-1 text-sm text-ink/60">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  )
}
