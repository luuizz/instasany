// Sequência de estudo a partir dos dias com atividade (AAAA-MM-DD no fuso de São Paulo)

const DAY = 24 * 60 * 60 * 1000
const toTime = (day: string) => Date.parse(`${day}T00:00:00Z`)
const toDay = (time: number) => new Date(time).toISOString().slice(0, 10)

export type StreakInfo = {
  current: number
  longest: number
  studiedToday: boolean
  // Últimos 7 dias, do mais antigo até hoje
  lastWeek: { day: string; active: boolean }[]
}

// A sequência continua viva se a pessoa estudou hoje ou ontem (hoje ainda dá tempo)
export function computeStreak(days: string[], today: string): StreakInfo {
  const active = new Set(days)
  const studiedToday = active.has(today)
  let cursor = toTime(today) - (studiedToday ? 0 : DAY)
  let current = 0
  while (active.has(toDay(cursor))) {
    current += 1
    cursor -= DAY
  }

  let longest = 0
  let run = 0
  let previous: number | null = null
  for (const day of [...active].sort()) {
    const time = toTime(day)
    run = previous !== null && time - previous === DAY ? run + 1 : 1
    longest = Math.max(longest, run)
    previous = time
  }

  const lastWeek = Array.from({ length: 7 }, (_, index) => {
    const day = toDay(toTime(today) - (6 - index) * DAY)
    return { day, active: active.has(day) }
  })
  return { current, longest: Math.max(longest, current), studiedToday, lastWeek }
}
