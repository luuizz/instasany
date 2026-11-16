import 'server-only'
import { asc, avg, count, eq, inArray } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'
import type { CatalogCourse, CourseLevel, CourseOutline, CourseSummary, ModuleItem } from '@/types/lms'
import { db, isDatabaseConfigured } from '../db/client'
import { courseModules, courseReviews, courses, lessons, quizQuestions, quizzes, type CourseRow } from '../db/schema'

export const COURSES_TAG = 'courses'

// Monta curso + módulos + aulas (em ordem) a partir de poucas consultas
async function loadOutlines(courseRows: CourseRow[]): Promise<CourseOutline[]> {
  if (!courseRows.length) return []
  const ids = courseRows.map((course) => course.id)
  const moduleRows = await db()
    .select()
    .from(courseModules)
    .where(inArray(courseModules.courseId, ids))
    .orderBy(asc(courseModules.sortOrder), asc(courseModules.id))
  const lessonRows = moduleRows.length
    ? await db()
        .select({
          id: lessons.id,
          moduleId: lessons.moduleId,
          title: lessons.title,
          durationMinutes: lessons.durationMinutes,
          videoUrl: lessons.videoUrl,
          releaseAfterDays: lessons.releaseAfterDays,
        })
        .from(lessons)
        .where(
          inArray(
            lessons.moduleId,
            moduleRows.map((module) => module.id),
          ),
        )
        .orderBy(asc(lessons.sortOrder), asc(lessons.id))
    : []

  const quizRows = moduleRows.length
    ? await db()
        .select({ moduleId: quizzes.moduleId, questions: count(quizQuestions.id) })
        .from(quizzes)
        .leftJoin(quizQuestions, eq(quizQuestions.quizId, quizzes.id))
        .where(
          inArray(
            quizzes.moduleId,
            moduleRows.map((module) => module.id),
          ),
        )
        .groupBy(quizzes.moduleId)
    : []

  return courseRows.map((course) => {
    const modules: ModuleItem[] = moduleRows
      .filter((module) => module.courseId === course.id)
      .map((module) => ({
        id: module.id,
        title: module.title,
        lessons: lessonRows
          .filter((lesson) => lesson.moduleId === module.id)
          .map(({ id, title, durationMinutes, videoUrl, releaseAfterDays }) => ({
            id,
            title,
            durationMinutes,
            hasVideo: Boolean(videoUrl),
            releaseAfterDays,
          })),
        quizQuestions: Number(quizRows.find((quiz) => quiz.moduleId === module.id)?.questions ?? 0),
      }))
    const all = modules.flatMap((module) => module.lessons)
    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      summary: course.summary,
      description: course.description,
      coverUrl: course.coverUrl,
      level: course.level as CourseLevel,
      published: course.published,
      modules,
      lessonCount: all.length,
      totalMinutes: all.reduce((total, lesson) => total + lesson.durationMinutes, 0),
    }
  })
}

const toSummary = (course: CourseOutline): CourseSummary => ({
  id: course.id,
  slug: course.slug,
  title: course.title,
  summary: course.summary,
  coverUrl: course.coverUrl,
  level: course.level,
  published: course.published,
  lessonCount: course.lessonCount,
  totalMinutes: course.totalMinutes,
})

const publishedOutlines = unstable_cache(
  async () => {
    if (!isDatabaseConfigured()) return []
    const rows = await db()
      .select()
      .from(courses)
      .where(eq(courses.published, true))
      .orderBy(asc(courses.sortOrder), asc(courses.id))
    return loadOutlines(rows)
  },
  ['published-courses'],
  { tags: [COURSES_TAG], revalidate: 3600 },
)

export const REVIEWS_TAG = 'reviews'

// Nota média por curso, em cache até alguém avaliar
const courseRatings = unstable_cache(
  async () => {
    if (!isDatabaseConfigured()) return []
    // Lista simples: o cache guarda em JSON, então nada de Map aqui
    const rows = await db()
      .select({ courseId: courseReviews.courseId, average: avg(courseReviews.rating), count: count() })
      .from(courseReviews)
      .groupBy(courseReviews.courseId)
    return rows.map((row) => ({ courseId: row.courseId, average: Number(row.average ?? 0), count: Number(row.count) }))
  },
  ['course-ratings'],
  { tags: [REVIEWS_TAG], revalidate: 3600 },
)

// Catálogo público (só cursos publicados), em cache até o painel alterar um curso
export async function listPublishedCourses(): Promise<CourseSummary[]> {
  try {
    return (await publishedOutlines()).map(toSummary)
  } catch (error) {
    console.error('[cursos] falha ao ler o catálogo:', error)
    return []
  }
}

// Catálogo com o que a listagem e a busca precisam: módulos, nomes das aulas e nota média
export async function listCatalog(): Promise<CatalogCourse[]> {
  try {
    const [outlines, ratings] = await Promise.all([publishedOutlines(), courseRatings()])
    return outlines.map((course) => ({
      ...toSummary(course),
      moduleCount: course.modules.length,
      keywords: course.modules.flatMap((module) => [module.title, ...module.lessons.map((lesson) => lesson.title)]),
      rating: ratings.find((rating) => rating.courseId === course.id) ?? null,
    }))
  } catch (error) {
    console.error('[cursos] falha ao ler o catálogo:', error)
    return []
  }
}

export async function getPublishedCourse(slug: string): Promise<CourseOutline | null> {
  return (await publishedOutlines()).find((course) => course.slug === slug) ?? null
}

// ---- painel: inclui rascunhos e sempre lê do banco ----

export async function listAllCourses(): Promise<CourseSummary[]> {
  const rows = await db().select().from(courses).orderBy(asc(courses.sortOrder), asc(courses.id))
  return (await loadOutlines(rows)).map(toSummary)
}

export async function getCourseById(id: number): Promise<CourseOutline | null> {
  const rows = await db().select().from(courses).where(eq(courses.id, id)).limit(1)
  return (await loadOutlines(rows))[0] ?? null
}

export async function getCourseBySlug(slug: string): Promise<CourseOutline | null> {
  const rows = await db().select().from(courses).where(eq(courses.slug, slug)).limit(1)
  return (await loadOutlines(rows))[0] ?? null
}
