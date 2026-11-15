import 'server-only'
import { count, desc, eq, gte, sql } from 'drizzle-orm'
import { db } from '../db/client'
import { courses, enrollments, lessonProgress, lessons, profiles } from '../db/schema'

export type DashboardStats = {
  publishedCourses: number
  draftCourses: number
  lessons: number
  students: number
  enrollments: number
  enrollmentsLastWeek: number
  completedLessons: number
}

export type RecentEnrollment = { studentName: string; studentEmail: string; courseTitle: string; createdAt: Date }

const total = async (query: Promise<{ value: number }[]>) => Number((await query)[0]?.value ?? 0)

// Números da visão geral do painel
export async function getDashboardStats(): Promise<DashboardStats> {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const [published, drafts, lessonCount, students, enrollmentCount, lastWeek, completed] = await Promise.all([
    total(db().select({ value: count() }).from(courses).where(eq(courses.published, true))),
    total(db().select({ value: count() }).from(courses).where(eq(courses.published, false))),
    total(db().select({ value: count() }).from(lessons)),
    total(db().select({ value: count() }).from(profiles).where(eq(profiles.role, 'student'))),
    total(db().select({ value: count() }).from(enrollments)),
    total(db().select({ value: count() }).from(enrollments).where(gte(enrollments.createdAt, weekAgo))),
    total(db().select({ value: count() }).from(lessonProgress)),
  ])
  return {
    publishedCourses: published,
    draftCourses: drafts,
    lessons: lessonCount,
    students,
    enrollments: enrollmentCount,
    enrollmentsLastWeek: lastWeek,
    completedLessons: completed,
  }
}

export async function listRecentEnrollments(limit = 6): Promise<RecentEnrollment[]> {
  const rows = await db()
    .select({
      studentName: sql<string>`coalesce(nullif(${profiles.name}, ''), ${profiles.email})`,
      studentEmail: profiles.email,
      courseTitle: courses.title,
      createdAt: enrollments.createdAt,
    })
    .from(enrollments)
    .innerJoin(profiles, eq(profiles.id, enrollments.profileId))
    .innerJoin(courses, eq(courses.id, enrollments.courseId))
    .orderBy(desc(enrollments.createdAt))
    .limit(limit)
  return rows
}
