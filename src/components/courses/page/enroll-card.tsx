import { CheckIcon } from 'lucide-react'
import { countLabel, formatDuration } from '@/lib/duration'
import type { CourseOutline } from '@/types/lms'
import { EnrollButton } from './enroll-button'

type EnrollCardProps = { course: CourseOutline; enrolled: boolean }

// Cartão lateral que acompanha a rolagem no desktop
export function EnrollCard({ course, enrolled }: EnrollCardProps) {
  const lines = [
    `${countLabel(course.lessonCount, 'aula', 'aulas')} · ${formatDuration(course.totalMinutes)}`,
    'Quizzes por módulo',
    'Certificado para o LinkedIn',
    'Acesso sem prazo',
  ]
  return (
    <div className="flex flex-col gap-5 rounded-3xl bg-paper p-6 shadow-xl ring-1 shadow-ink/5 ring-ink/10">
      <div>
        <p className="text-sm text-ink/65">Investimento</p>
        <p className="text-4xl font-semibold text-ink">Grátis</p>
      </div>
      <ul className="flex flex-col gap-2.5">
        {lines.map((line) => (
          <li key={line} className="flex items-center gap-2.5 text-sm text-ink/75">
            <CheckIcon className="size-4 text-sage" strokeWidth={2.5} />
            {line}
          </li>
        ))}
      </ul>
      <EnrollButton slug={course.slug} enrolled={enrolled} fullWidth />
    </div>
  )
}
