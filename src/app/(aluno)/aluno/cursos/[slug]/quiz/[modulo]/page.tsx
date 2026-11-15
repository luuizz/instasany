import { CheckCircle2Icon } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CourseAside } from '@/components/lms/course-aside'
import { QuizRunner } from '@/components/lms/quiz/quiz-runner'
import { Container } from '@/components/ui/container'
import { requireUser } from '@/server/auth/session'
import { getCourseBySlug } from '@/server/services/courses'
import { completedLessonIds } from '@/server/services/learning'
import { getStudentQuiz, passedQuizModules } from '@/server/services/quiz'

export const metadata: Metadata = { title: 'Quiz do módulo' }

type PageProps = { params: Promise<{ slug: string; modulo: string }> }

export default async function StudentQuizPage({ params }: PageProps) {
  const { slug, modulo } = await params
  const profile = await requireUser(`/aluno/cursos/${slug}/quiz/${modulo}`)
  const quiz = await getStudentQuiz(profile, slug, Number(modulo))
  const course = quiz ? await getCourseBySlug(slug) : null
  if (!quiz || !course) notFound()

  const [completed, passedQuizzes] = await Promise.all([
    completedLessonIds(
      profile.id,
      course.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id)),
    ),
    passedQuizModules(
      profile.id,
      course.modules.map((module) => module.id),
    ),
  ])
  const nextLesson = course.modules.at(quiz.moduleNumber)?.lessons.at(0)
  const next = nextLesson
    ? { href: `/aluno/cursos/${slug}/aulas/${nextLesson.id}`, label: 'Ir para o próximo módulo' }
    : { href: '/aluno', label: 'Voltar para meus cursos' }

  return (
    <Container className="grid gap-8 py-8 lg:grid-cols-[1fr_22rem] lg:py-12">
      <article className="flex min-w-0 flex-col gap-6">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium text-sage">
            Módulo {quiz.moduleNumber} · {quiz.moduleTitle}
          </p>
          <h1 className="text-3xl font-semibold text-ink sm:text-4xl">Quiz do módulo</h1>
          <p className="text-ink/70">
            {quiz.questions.length} {quiz.questions.length === 1 ? 'pergunta' : 'perguntas'}. Acerte {quiz.passPercent}%
            para passar; dá para refazer quantas vezes quiser.
          </p>
          {quiz.best?.passed && (
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-pine">
              <CheckCircle2Icon className="size-4 text-sage" />
              Você já passou neste quiz ({quiz.best.score} de {quiz.best.total}).
            </p>
          )}
        </header>
        <QuizRunner quiz={quiz} next={next} />
      </article>
      <CourseAside
        course={course}
        profileId={profile.id}
        completed={[...completed]}
        passedQuizzes={passedQuizzes}
        currentQuiz={quiz.moduleId}
      />
    </Container>
  )
}
