const TIME_ZONE = 'America/Sao_Paulo'

const short = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: TIME_ZONE })
const withTime = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: TIME_ZONE,
})
const relative = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })

export const formatDate = (date: Date) => short.format(date)
export const formatDateTime = (date: Date) => withTime.format(date)

const steps: [Intl.RelativeTimeFormatUnit, number][] = [
  ['minute', 60],
  ['hour', 24],
  ['day', 30],
  ['month', 12],
  ['year', Infinity],
]

// "há 5 minutos", "ontem", "há 3 meses"
export function formatRelative(date: Date, now = Date.now()) {
  let value = (date.getTime() - now) / 60_000
  if (Math.abs(value) < 1) return 'agora'
  for (const [unit, size] of steps) {
    if (Math.abs(value) < size) return relative.format(Math.round(value), unit)
    value /= size
  }
  return formatDate(date)
}
