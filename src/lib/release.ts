// Liberação gradual: a aula abre `releaseAfterDays` dias depois da matrícula.
// enrolledAt nulo = quem vê é admin (sem matrícula), e para ele tudo está aberto.

const DAY = 24 * 60 * 60 * 1000

export const releaseDate = (enrolledAt: Date, releaseAfterDays: number) =>
  new Date(enrolledAt.getTime() + releaseAfterDays * DAY)

export function isReleased(enrolledAt: Date | null, releaseAfterDays: number, now = Date.now()) {
  if (!enrolledAt || releaseAfterDays <= 0) return true
  return releaseDate(enrolledAt, releaseAfterDays).getTime() <= now
}
