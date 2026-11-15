import type { RecentEnrollment } from '@/server/services/dashboard'

const when = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Sao_Paulo',
})

const initials = (name: string) =>
  name
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

export function RecentEnrollments({ enrollments }: { enrollments: RecentEnrollment[] }) {
  return (
    <section
      aria-labelledby="matriculas-recentes"
      className="animate-in rounded-3xl border border-border p-6 delay-150 duration-500 fill-mode-both fade-in slide-in-from-bottom-3"
    >
      <h2 id="matriculas-recentes" className="text-lg font-semibold">
        Matrículas recentes
      </h2>
      {enrollments.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-muted p-6 text-sm text-muted-foreground">
          Nenhuma matrícula ainda. Quando alguém se matricular em um curso, aparece aqui.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {enrollments.map((enrollment) => (
            <li key={`${enrollment.studentEmail}-${enrollment.courseTitle}`} className="flex items-center gap-4 py-3">
              <span
                aria-hidden
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-pine"
              >
                {initials(enrollment.studentName)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{enrollment.studentName}</span>
                <span className="block truncate text-sm text-muted-foreground">{enrollment.courseTitle}</span>
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">{when.format(enrollment.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
