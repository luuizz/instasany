import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { initialsOf } from '@/lib/account'
import type { RecentEnrollment } from '@/server/services/dashboard'

const when = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Sao_Paulo',
})

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
              <Avatar aria-hidden className="size-10">
                <AvatarFallback className="bg-secondary text-sm font-bold text-pine">
                  {initialsOf(enrollment.studentName)}
                </AvatarFallback>
              </Avatar>
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
