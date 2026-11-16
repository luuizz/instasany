import { PlayIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ButtonLink } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import type { DashboardCourse } from '@/types/lms'

const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`

// Destaque do dashboard: o curso mexido por último, com a próxima aula e onde o vídeo parou
export function ContinueCard({ course }: { course: DashboardCourse }) {
  const percent = course.lessonCount ? Math.round((course.completedCount / course.lessonCount) * 100) : 0
  const done = course.completedCount >= course.lessonCount
  const href = course.nextLessonId
    ? `/aluno/cursos/${course.slug}/aulas/${course.nextLessonId}`
    : `/aluno/cursos/${course.slug}`

  return (
    <section
      aria-labelledby="continuar"
      className="grid animate-in grid-cols-1 overflow-hidden rounded-3xl border border-ink/10 bg-card shadow-sm duration-500 fade-in slide-in-from-bottom-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]"
    >
      <Link href={href} className="group relative block min-h-52 overflow-hidden bg-pine" tabIndex={-1} aria-hidden>
        {course.coverUrl ? (
          <Image
            src={course.coverUrl}
            alt=""
            fill
            sizes="(min-width: 768px) 420px, 100vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <span className="absolute inset-0 cover-art" />
        )}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-lime text-pine shadow-xl shadow-ink/30 transition group-hover:scale-110">
            <PlayIcon className="ml-1 size-7 fill-pine" />
          </span>
        </span>
      </Link>
      <div className="flex flex-col gap-4 p-6 sm:p-8">
        <p id="continuar" className="text-sm font-semibold tracking-wider text-sage uppercase">
          {done ? 'Curso concluído' : 'Continue de onde parou'}
        </p>
        <div>
          <h2 className="text-2xl font-semibold text-balance text-ink">{course.title}</h2>
          {course.nextLessonTitle && !done && (
            <p className="mt-2 text-ink/70">
              Próxima aula: <span className="font-medium text-ink">{course.nextLessonTitle}</span>
              {course.resumeAt > 0 && <span className="text-ink/50"> · parou em {clock(course.resumeAt)}</span>}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Progress value={percent} aria-label={`${percent}% do curso`} className="h-2.5" />
          <span className="w-12 text-right text-sm font-semibold tabular-nums">{percent}%</span>
        </div>
        <p className="text-sm text-ink/50">
          {course.completedCount} de {course.lessonCount} aulas concluídas
        </p>
        <div className="mt-auto flex flex-wrap gap-3 pt-2">
          <ButtonLink href={href} size="default">
            <PlayIcon className="fill-current" />
            {done ? 'Rever o curso' : course.completedCount ? 'Continuar aula' : 'Começar o curso'}
          </ButtonLink>
          {course.certificateCode && (
            <ButtonLink href={`/certificado/${course.certificateCode}`} variant="outline" size="default">
              Ver certificado
            </ButtonLink>
          )}
        </div>
      </div>
    </section>
  )
}
