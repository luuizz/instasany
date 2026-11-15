import 'server-only'
import { eq } from 'drizzle-orm'
import { isTrackedPath, type SERVER_EVENT_TYPES } from '@/lib/analytics'
import type { ClientEvent } from '@/lib/validation/analytics'
import type { Profile } from '../auth/session'
import { db } from '../db/client'
import { analyticsEvents, courseModules, lessons } from '../db/schema'

// Uso da equipe não entra nos números
const counts = (profile: Profile | null) => profile?.role !== 'admin'

async function courseOfLesson(lessonId: number) {
  const [row] = await db()
    .select({ courseId: courseModules.courseId })
    .from(lessons)
    .innerJoin(courseModules, eq(courseModules.id, lessons.moduleId))
    .where(eq(lessons.id, lessonId))
    .limit(1)
  return row?.courseId ?? null
}

// Evento enviado pelo navegador (já validado). Vídeo só conta para quem está logado.
export async function recordClientEvent(event: ClientEvent, profile: Profile | null) {
  if (!counts(profile)) return
  const base = { type: event.type, visitorId: event.visitorId, profileId: profile?.id ?? null }

  if (event.type === 'page_view') {
    if (!isTrackedPath(event.path)) return
    await db()
      .insert(analyticsEvents)
      .values({ ...base, path: event.path })
    return
  }

  if (!profile || (event.type === 'video_watch' && event.seconds < 1)) return
  const courseId = await courseOfLesson(event.lessonId)
  if (!courseId) return
  await db()
    .insert(analyticsEvents)
    .values({ ...base, courseId, lessonId: event.lessonId, seconds: event.seconds })
}

// Eventos que só o servidor conhece (matrícula, aula concluída)
export async function recordServerEvent(
  type: (typeof SERVER_EVENT_TYPES)[number],
  profile: Profile,
  target: { courseId: number } | { lessonId: number },
) {
  if (!counts(profile)) return
  const lessonId = 'lessonId' in target ? target.lessonId : null
  const courseId = 'courseId' in target ? target.courseId : await courseOfLesson(target.lessonId)
  if (!courseId) return
  await db().insert(analyticsEvents).values({ type, profileId: profile.id, courseId, lessonId })
}
