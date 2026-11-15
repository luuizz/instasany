import 'server-only'
import { and, avg, count, desc, eq, ne } from 'drizzle-orm'
import { firstNameOf } from '@/lib/account'
import type { ReviewSummary } from '@/types/lms'
import { db } from '../db/client'
import { courseReviews, profiles } from '../db/schema'
import { isEnrolled } from './learning'

// Média, total e os comentários mais recentes (mostrados só com o primeiro nome)
export async function getReviewSummary(courseId: number): Promise<ReviewSummary> {
  const [[totals], latest] = await Promise.all([
    db()
      .select({ average: avg(courseReviews.rating), count: count() })
      .from(courseReviews)
      .where(eq(courseReviews.courseId, courseId)),
    db()
      .select({
        name: profiles.name,
        email: profiles.email,
        rating: courseReviews.rating,
        comment: courseReviews.comment,
        updatedAt: courseReviews.updatedAt,
      })
      .from(courseReviews)
      .innerJoin(profiles, eq(profiles.id, courseReviews.profileId))
      .where(and(eq(courseReviews.courseId, courseId), ne(courseReviews.comment, '')))
      .orderBy(desc(courseReviews.updatedAt))
      .limit(6),
  ])
  return {
    average: Number(totals?.average ?? 0),
    count: Number(totals?.count ?? 0),
    latest: latest.map(({ name, email, ...review }) => ({ ...review, name: firstNameOf(name, email) })),
  }
}

export async function getMyReview(profileId: string, courseId: number) {
  const [row] = await db()
    .select({ rating: courseReviews.rating, comment: courseReviews.comment })
    .from(courseReviews)
    .where(and(eq(courseReviews.profileId, profileId), eq(courseReviews.courseId, courseId)))
    .limit(1)
  return row ?? null
}

// Só quem está matriculado avalia; avaliar de novo substitui a anterior
export async function saveReview(profileId: string, courseId: number, review: { rating: number; comment: string }) {
  if (!(await isEnrolled(profileId, courseId))) return false
  await db()
    .insert(courseReviews)
    .values({ profileId, courseId, ...review })
    .onConflictDoUpdate({
      target: [courseReviews.profileId, courseReviews.courseId],
      set: { ...review, updatedAt: new Date() },
    })
  return true
}
