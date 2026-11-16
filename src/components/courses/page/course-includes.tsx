import {
  AwardIcon,
  ClockIcon,
  ListChecksIcon,
  MessagesSquareIcon,
  PlayCircleIcon,
  RotateCcwIcon,
  type LucideIcon,
} from 'lucide-react'
import { countLabel, formatDuration } from '@/lib/duration'
import type { CourseOutline } from '@/types/lms'

type Item = { icon: LucideIcon; title: string; text: string }

// O que vem com o curso, calculado da ementa (vídeos, quizzes, duração) mais o que a plataforma oferece
export function courseIncludes(course: CourseOutline): Item[] {
  const lessons = course.modules.flatMap((module) => module.lessons)
  const videos = lessons.filter((lesson) => lesson.hasVideo).length
  const questions = course.modules.reduce((total, module) => total + module.quizQuestions, 0)
  const items: Item[] = [
    {
      icon: PlayCircleIcon,
      title: videos
        ? countLabel(videos, 'aula em vídeo', 'aulas em vídeo')
        : countLabel(lessons.length, 'aula', 'aulas'),
      text: 'Curtas e diretas, para assistir no intervalo e aplicar no mesmo dia.',
    },
    {
      icon: ClockIcon,
      title: `${formatDuration(course.totalMinutes)} de conteúdo`,
      text: 'Estude no seu ritmo, sem prazo para terminar.',
    },
  ]
  if (questions) {
    items.push({
      icon: ListChecksIcon,
      title: countLabel(questions, 'questão de quiz', 'questões de quiz'),
      text: 'Um quiz por módulo para fixar o que você aprendeu.',
    })
  }
  items.push(
    { icon: RotateCcwIcon, title: 'Volta de onde parou', text: 'O vídeo lembra onde você estava em cada aula.' },
    {
      icon: MessagesSquareIcon,
      title: 'Dúvidas por aula',
      text: 'Pergunte embaixo da aula; alunos e equipe respondem.',
    },
    { icon: AwardIcon, title: 'Certificado verificável', text: 'Com código de conferência e pronto para o LinkedIn.' },
  )
  return items
}

export function CourseIncludes({ course }: { course: CourseOutline }) {
  return (
    <section aria-labelledby="incluso">
      <h2 id="incluso" className="text-2xl font-semibold text-ink">
        O que está incluso
      </h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {courseIncludes(course).map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex flex-col gap-3 rounded-3xl bg-paper p-5 ring-1 ring-ink/10">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-lime text-pine">
              <Icon className="size-5" />
            </span>
            <span className="font-semibold text-ink">{title}</span>
            <span className="text-sm text-ink/65">{text}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
