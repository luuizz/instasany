export type LessonFunnelItem = {
  lessonId: number
  title: string
  moduleTitle: string
  completed: number
  // Quanto dos matriculados concluiu a aula (0 a 100)
  percent: number
  // Queda em relação à aula anterior, em pontos percentuais
  drop: number
}

export type QuizReportItem = {
  moduleTitle: string
  students: number
  attempts: number
  passed: number
  averagePercent: number
}

export type CourseReportStudent = {
  name: string
  email: string
  enrolledAt: Date | null
  completed: number
  total: number
  lastActivity: Date | null
  certificateCode: string | null
}

export type CourseReport = {
  enrolled: number
  enrolledLast30: number
  finished: number
  certificates: number
  averageProgress: number
  rating: { average: number; count: number }
  funnel: LessonFunnelItem[]
  quizzes: QuizReportItem[]
  students: CourseReportStudent[]
}
