import type { COURSE_LEVELS } from '@/lib/validation/lms'

export type CourseLevel = (typeof COURSE_LEVELS)[number]

export type LessonItem = { id: number; title: string; durationMinutes: number; hasVideo: boolean }
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
