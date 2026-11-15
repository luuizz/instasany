// Regras da análise de uso que valem no navegador e no servidor

// Eventos que o navegador pode enviar; matrícula e aula concluída são gravadas pelo servidor
export const CLIENT_EVENT_TYPES = ['page_view', 'video_play', 'video_watch'] as const
export const SERVER_EVENT_TYPES = ['enrollment', 'lesson_complete'] as const

// Tempo assistido é enviado em blocos; um bloco nunca passa disso (protege contra valores forjados)
export const WATCH_FLUSH_SECONDS = 30
export const MAX_WATCH_SECONDS = 120

export const VISITOR_STORAGE_KEY = 'instasany-visitante'

// Períodos da página de análise, em dias
export const ANALYTICS_PERIODS = [7, 30, 90] as const
export type AnalyticsPeriod = (typeof ANALYTICS_PERIODS)[number]

export const parsePeriod = (value: unknown): AnalyticsPeriod => {
  const days = Number(value)
  return ANALYTICS_PERIODS.find((period) => period === days) ?? 30
}

// Áreas que não entram na contagem de páginas vistas
export const isTrackedPath = (path: string) => !path.startsWith('/admin') && !path.startsWith('/api')
