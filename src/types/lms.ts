import type { COURSE_LEVELS } from '@/lib/validation/lms'

export type CourseLevel = (typeof COURSE_LEVELS)[number]

export type LessonItem = {
  id: number
  title: string
  durationMinutes: number
  hasVideo: boolean
  releaseAfterDays: number
}
// quizQuestions = 0 quando o módulo não tem quiz
export type ModuleItem = { id: number; title: string; lessons: LessonItem[]; quizQuestions: number }

export type CourseSummary = {
  id: number
  slug: string
  title: string
  summary: string
  coverUrl: string | null
  level: CourseLevel
  published: boolean
  lessonCount: number
  totalMinutes: number
}

export type CourseOutline = CourseSummary & { description: string; modules: ModuleItem[] }

export type Lesson = LessonItem & { moduleId: number; content: string; videoUrl: string | null }

export type StudentCourse = CourseSummary & {
  completedCount: number
  // Primeira aula ainda não concluída (ou a primeira, se todas foram)
  nextLessonId: number | null
  nextLessonTitle: string | null
}

// Curso no dashboard do aluno, com o que falta e o que já tem
export type DashboardCourse = StudentCourse & {
  lastActivityAt: Date | null
  certificateCode: string | null
  // Onde parou no vídeo da próxima aula (segundos)
  resumeAt: number
}

export type StudentDashboard = {
  courses: DashboardCourse[]
  // Curso mexido por último que ainda não terminou (ou o último, se todos terminaram)
  current: DashboardCourse | null
  stats: { inProgress: number; lessonsDone: number; watchedMinutes: number; certificates: number }
  // Aulas concluídas por dia nos últimos 7 dias (fuso de São Paulo)
  week: { day: string; count: number }[]
  recent: { lessonTitle: string; courseTitle: string; href: string; completedAt: Date }[]
}

export type LessonAttachment = { id: number; title: string; url: string; sizeBytes: number; contentType: string }

export type QuizQuestionInput = { prompt: string; options: string[]; correctIndex: number; explanation: string }
export type QuizDraft = { passPercent: number; questions: QuizQuestionInput[] }

// Quiz como o aluno vê: sem a resposta certa
export type StudentQuiz = {
  id: number
  moduleId: number
  moduleTitle: string
  moduleNumber: number
  passPercent: number
  questions: { id: number; prompt: string; options: string[] }[]
  best: { score: number; total: number; passed: boolean } | null
}

export type QuizResult = {
  score: number
  total: number
  percent: number
  passed: boolean
  passPercent: number
  review: { prompt: string; options: string[]; chosen: number; correct: number; explanation: string }[]
}

export type CourseCompletion = {
  lessonsDone: number
  lessonsTotal: number
  quizzesPassed: number
  quizzesTotal: number
  complete: boolean
}

export type Certificate = {
  code: string
  // Dono do certificado (para mostrar os botões de compartilhar só para ele)
  profileId: string
  studentName: string
  courseTitle: string
  courseSlug: string | null
  totalMinutes: number
  // Data da matrícula, se ela ainda existir
  startedAt: Date | null
  issuedAt: Date
}

export type CourseReview = { name: string; rating: number; comment: string; updatedAt: Date }
export type ReviewSummary = { average: number; count: number; latest: CourseReview[] }

export type QuestionMessage = {
  id: number
  body: string
  createdAt: Date
  author: { name: string; initials: string; isStaff: boolean; isMine: boolean }
}
export type QuestionThread = QuestionMessage & { replies: QuestionMessage[] }

// Dúvida na fila do painel, com onde foi feita e se a equipe já respondeu
export type AdminQuestion = QuestionThread & {
  lessonId: number
  lessonTitle: string
  courseTitle: string
  courseSlug: string
  answered: boolean
}

// Curso como aparece na listagem pública e na busca do site
export type CatalogCourse = CourseSummary & {
  moduleCount: number
  // Nomes dos módulos e aulas, para a busca achar o curso pelo conteúdo
  keywords: string[]
  rating: { average: number; count: number } | null
}
