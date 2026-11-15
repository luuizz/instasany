import type { COURSE_LEVELS } from '@/lib/validation/lms'

export type CourseLevel = (typeof COURSE_LEVELS)[number]

export type LessonItem = { id: number; title: string; durationMinutes: number; hasVideo: boolean }
export type ModuleItem = { id: number; title: string; lessons: LessonItem[] }

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
