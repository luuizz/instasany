import 'server-only'
import { and, asc, desc, eq, inArray, isNull } from 'drizzle-orm'
import { firstNameOf, initialsOf } from '@/lib/account'
import type { AdminQuestion, QuestionMessage, QuestionThread } from '@/types/lms'
import { db } from '../db/client'
import { courseModules, courses, lessonQuestions, lessons, profiles } from '../db/schema'
import { getLesson } from './course-admin'
import { isEnrolled } from './learning'

type Viewer = { id: string; role: 'student' | 'admin' }

const messageColumns = {
  id: lessonQuestions.id,
  parentId: lessonQuestions.parentId,
  lessonId: lessonQuestions.lessonId,
  profileId: lessonQuestions.profileId,
  body: lessonQuestions.body,
  createdAt: lessonQuestions.createdAt,
  name: profiles.name,
  email: profiles.email,
  role: profiles.role,
}

type MessageRow = {
  id: number
  profileId: string
  body: string
  createdAt: Date
  name: string
  email: string
  role: 'student' | 'admin'
}

const toMessage = (row: MessageRow, viewerId: string): QuestionMessage => ({
  id: row.id,
  body: row.body,
  createdAt: row.createdAt,
  author: {
    name: firstNameOf(row.name, row.email),
    initials: initialsOf(row.name || row.email),
    isStaff: row.role === 'admin',
    isMine: row.profileId === viewerId,
  },
})

async function repliesOf(rootIds: number[]) {
  if (!rootIds.length) return []
  return db()
    .select(messageColumns)
    .from(lessonQuestions)
    .innerJoin(profiles, eq(profiles.id, lessonQuestions.profileId))
    .where(inArray(lessonQuestions.parentId, rootIds))
    .orderBy(asc(lessonQuestions.createdAt))
}

// Conversas da aula, da mais recente para a mais antiga, com as respostas em ordem
export async function listThreads(lessonId: number, viewerId: string): Promise<QuestionThread[]> {
  const roots = await db()
    .select(messageColumns)
    .from(lessonQuestions)
    .innerJoin(profiles, eq(profiles.id, lessonQuestions.profileId))
    .where(and(eq(lessonQuestions.lessonId, lessonId), isNull(lessonQuestions.parentId)))
    .orderBy(desc(lessonQuestions.createdAt))
  const replies = await repliesOf(roots.map((root) => root.id))
  return roots.map((root) => ({
    ...toMessage(root, viewerId),
    replies: replies.filter((reply) => reply.parentId === root.id).map((reply) => toMessage(reply, viewerId)),
  }))
}

async function canParticipate(viewer: Viewer, lessonId: number) {
  const lesson = await getLesson(lessonId)
  if (!lesson) return false
  return viewer.role === 'admin' || isEnrolled(viewer.id, lesson.courseId)
}

export async function askQuestion(viewer: Viewer, lessonId: number, body: string) {
  if (!(await canParticipate(viewer, lessonId))) return false
  await db().insert(lessonQuestions).values({ lessonId, profileId: viewer.id, body })
  return true
}

// Resposta sempre vai para a pergunta que abriu a conversa
export async function replyToQuestion(viewer: Viewer, questionId: number, body: string) {
  const [root] = await db()
    .select({ lessonId: lessonQuestions.lessonId, parentId: lessonQuestions.parentId })
    .from(lessonQuestions)
    .where(eq(lessonQuestions.id, questionId))
    .limit(1)
  if (!root || root.parentId !== null || !(await canParticipate(viewer, root.lessonId))) return null
  await db()
    .insert(lessonQuestions)
    .values({ lessonId: root.lessonId, profileId: viewer.id, parentId: questionId, body })
  return root.lessonId
}

// Quem escreveu apaga a própria mensagem; a equipe apaga qualquer uma (apagar a pergunta leva as respostas)
export async function deleteQuestionMessage(viewer: Viewer, messageId: number) {
  const condition =
    viewer.role === 'admin'
      ? eq(lessonQuestions.id, messageId)
      : and(eq(lessonQuestions.id, messageId), eq(lessonQuestions.profileId, viewer.id))
  const deleted = await db().delete(lessonQuestions).where(condition).returning({ id: lessonQuestions.id })
  return deleted.length > 0
}

// Fila do painel: perguntas sem resposta da equipe primeiro
export async function listQuestionsForAdmin(viewerId: string, onlyPending: boolean): Promise<AdminQuestion[]> {
  const roots = await db()
    .select({
      ...messageColumns,
      lessonTitle: lessons.title,
      courseTitle: courses.title,
      courseSlug: courses.slug,
    })
    .from(lessonQuestions)
    .innerJoin(profiles, eq(profiles.id, lessonQuestions.profileId))
    .innerJoin(lessons, eq(lessons.id, lessonQuestions.lessonId))
    .innerJoin(courseModules, eq(courseModules.id, lessons.moduleId))
    .innerJoin(courses, eq(courses.id, courseModules.courseId))
    .where(isNull(lessonQuestions.parentId))
    .orderBy(desc(lessonQuestions.createdAt))
    .limit(100)
  const replies = await repliesOf(roots.map((root) => root.id))
  const threads = roots.map((root) => {
    const own = replies.filter((reply) => reply.parentId === root.id)
    return {
      ...toMessage(root, viewerId),
      replies: own.map((reply) => toMessage(reply, viewerId)),
      lessonId: root.lessonId,
      lessonTitle: root.lessonTitle,
      courseTitle: root.courseTitle,
      courseSlug: root.courseSlug,
      answered: root.role === 'admin' || own.some((reply) => reply.role === 'admin'),
    }
  })
  const sorted = [...threads.filter((thread) => !thread.answered), ...threads.filter((thread) => thread.answered)]
  return onlyPending ? sorted.filter((thread) => !thread.answered) : sorted
}
