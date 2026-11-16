import { AwardIcon, CheckCircle2Icon } from 'lucide-react'
import Link from 'next/link'
import { formatRelative } from '@/lib/dates'
import type { DashboardCourse, StudentDashboard } from '@/types/lms'

export function CertificateList({ courses }: { courses: DashboardCourse[] }) {
  const issued = courses.filter((course) => course.certificateCode)
  return (
    <section aria-labelledby="certificados" className="rounded-3xl border border-ink/10 bg-paper p-5">
      <h2 id="certificados" className="font-semibold text-ink">
        Certificados
      </h2>
      {issued.length ? (
        <ul className="mt-4 flex flex-col gap-2">
          {issued.map((course) => (
            <li key={course.id}>
              <Link
                href={`/certificado/${course.certificateCode}`}
                className="flex items-center gap-3 rounded-2xl bg-pine p-3 text-paper transition hover:bg-pine-line"
              >
                <AwardIcon className="size-5 shrink-0 text-lime" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{course.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-ink/60">
          Conclua todas as aulas e quizzes de um curso para ganhar o certificado e compartilhar no LinkedIn.
        </p>
      )}
    </section>
  )
}

export function RecentList({ items }: { items: StudentDashboard['recent'] }) {
  if (!items.length) return null
  return (
    <section aria-labelledby="conquistas" className="rounded-3xl border border-ink/10 bg-paper p-5">
      <h2 id="conquistas" className="font-semibold text-ink">
        Últimas aulas concluídas
      </h2>
      <ol className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <li key={`${item.href}-${item.completedAt.getTime()}`}>
            <Link href={item.href} className="group flex gap-3">
              <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-sage" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-ink group-hover:underline">
                  {item.lessonTitle}
                </span>
                <span className="block truncate text-xs text-ink/50">
                  {item.courseTitle} · {formatRelative(item.completedAt)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
