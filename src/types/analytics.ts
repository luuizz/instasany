import type { AnalyticsPeriod } from '@/lib/analytics'

export type AnalyticsTotals = {
  visitors: number
  pageViews: number
  activeStudents: number
  watchedMinutes: number
  enrollments: number
  completions: number
}

export type DailyPoint = { day: string; pageViews: number; visitors: number }
export type RankedItem = { label: string; detail?: string; value: number }
export type FunnelStep = { label: string; detail: string; value: number }
export type LessonEngagement = {
  lessonId: number
  title: string
  courseTitle: string
  students: number
  watchedMinutes: number
  completions: number
}

export type AnalyticsReport = {
  period: AnalyticsPeriod
  totals: AnalyticsTotals
  daily: DailyPoint[]
  topPages: RankedItem[]
  funnel: FunnelStep[]
  lessons: LessonEngagement[]
}
