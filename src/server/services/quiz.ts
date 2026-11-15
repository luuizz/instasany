import 'server-only'
import { and, asc, desc, eq, inArray } from 'drizzle-orm'
import type { QuizDraft, QuizResult, StudentQuiz } from '@/types/lms'
import { db } from '../db/client'
import { courseModules, quizAttempts, quizQuestions, quizzes } from '../db/schema'
import { getCourseBySlug } from './courses'
import { isEnrolled } from './learning'

type Viewer = { id: string; role: 'student' | 'admin' }

async function quizOfModule(moduleId: number) {
  const [quiz] = await db().select().from(quizzes).where(eq(quizzes.moduleId, moduleId)).limit(1)
  return quiz ?? null
}

const questionsOf = (quizId: number) =>
  db().select().from(quizQuestions).where(eq(quizQuestions.quizId, quizId)).orderBy(asc(quizQuestions.sortOrder))

// ---- painel ----

export async function getQuizDraft(moduleId: number): Promise<QuizDraft | null> {
  const quiz = await quizOfModule(moduleId)
  if (!quiz) return null
  const questions = await questionsOf(quiz.id)
  return {
    passPercent: quiz.passPercent,
    questions: questions.map(({ prompt, options, correctIndex, explanation }) => ({
      prompt,
      options,
      correctIndex,
      explanation,
    })),
  }
}

// Salva o quiz inteiro de uma vez: as perguntas são trocadas pela lista nova
export async function saveQuiz(moduleId: number, draft: QuizDraft) {
  await db().transaction(async (tx) => {
    const [quiz] = await tx
      .insert(quizzes)
      .values({ moduleId, passPercent: draft.passPercent })
      .onConflictDoUpdate({ target: quizzes.moduleId, set: { passPercent: draft.passPercent, updatedAt: new Date() } })
      .returning({ id: quizzes.id })
    if (!quiz) throw new Error('Não foi possível salvar o quiz.')
    await tx.delete(quizQuestions).where(eq(quizQuestions.quizId, quiz.id))
    await tx
      .insert(quizQuestions)
      .values(draft.questions.map((question, index) => ({ ...question, quizId: quiz.id, sortOrder: index })))
  })
}

export async function deleteQuiz(moduleId: number) {
  await db().delete(quizzes).where(eq(quizzes.moduleId, moduleId))
}

// ---- aluno ----

async function bestAttempt(profileId: string, quizId: number) {
  const [row] = await db()
    .select({ score: quizAttempts.score, total: quizAttempts.total, passed: quizAttempts.passed })
    .from(quizAttempts)
    .where(and(eq(quizAttempts.profileId, profileId), eq(quizAttempts.quizId, quizId)))
    .orderBy(desc(quizAttempts.passed), desc(quizAttempts.score), desc(quizAttempts.createdAt))
    .limit(1)
  return row ?? null
}

// Quiz do módulo para quem está matriculada (admin vê todos); null se não houver
export async function getStudentQuiz(viewer: Viewer, slug: string, moduleId: number): Promise<StudentQuiz | null> {
  const course = await getCourseBySlug(slug)
  if (!course) return null
  if (viewer.role !== 'admin' && (!course.published || !(await isEnrolled(viewer.id, course.id)))) return null
  const moduleIndex = course.modules.findIndex((module) => module.id === moduleId)
  const courseModule = course.modules[moduleIndex]
  const quiz = courseModule ? await quizOfModule(moduleId) : null
  if (!courseModule || !quiz) return null
  const [questions, best] = await Promise.all([questionsOf(quiz.id), bestAttempt(viewer.id, quiz.id)])
  if (!questions.length) return null
  return {
    id: quiz.id,
    moduleId,
    moduleTitle: courseModule.title,
    moduleNumber: moduleIndex + 1,
    passPercent: quiz.passPercent,
    questions: questions.map(({ id, prompt, options }) => ({ id, prompt, options })),
    best,
  }
}

// Corrige no servidor (a resposta certa nunca vai para o navegador antes do envio) e guarda a tentativa
export async function submitQuiz(viewer: Viewer, quizId: number, answers: number[]): Promise<QuizResult | null> {
  const [row] = await db()
    .select({ quiz: quizzes, courseId: courseModules.courseId })
    .from(quizzes)
    .innerJoin(courseModules, eq(courseModules.id, quizzes.moduleId))
    .where(eq(quizzes.id, quizId))
    .limit(1)
  if (!row) return null
  if (viewer.role !== 'admin' && !(await isEnrolled(viewer.id, row.courseId))) return null
  const questions = await questionsOf(quizId)
  if (!questions.length) return null

  const chosen = questions.map((_, index) => answers.at(index) ?? -1)
  const score = questions.filter((question, index) => question.correctIndex === chosen.at(index)).length
  const percent = Math.round((score / questions.length) * 100)
  const passed = percent >= row.quiz.passPercent
  await db()
    .insert(quizAttempts)
    .values({ profileId: viewer.id, quizId, score, total: questions.length, passed, answers: chosen })

  return {
    score,
    total: questions.length,
    percent,
    passed,
    passPercent: row.quiz.passPercent,
    review: questions.map((question, index) => ({
      prompt: question.prompt,
      options: question.options,
      chosen: chosen.at(index) ?? -1,
      correct: question.correctIndex,
      explanation: question.explanation,
    })),
  }
}

// Módulos cujo quiz a pessoa já passou (para a lista de aulas e o certificado)
export async function passedQuizModules(profileId: string, moduleIds: number[]) {
  if (!moduleIds.length) return []
  const rows = await db()
    .selectDistinct({ moduleId: quizzes.moduleId })
    .from(quizAttempts)
    .innerJoin(quizzes, eq(quizzes.id, quizAttempts.quizId))
    .where(
      and(eq(quizAttempts.profileId, profileId), eq(quizAttempts.passed, true), inArray(quizzes.moduleId, moduleIds)),
    )
  return rows.map((row) => row.moduleId)
}
