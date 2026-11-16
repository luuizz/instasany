import 'server-only'
import type { Role } from '@/lib/roles'
import { randomBytes } from 'node:crypto'
import { and, desc, eq } from 'drizzle-orm'
import type { Certificate, CourseCompletion, CourseOutline, MyCertificate } from '@/types/lms'
import { db } from '../db/client'
import { certificates, courses, enrollments } from '../db/schema'
import { getCourseBySlug } from './courses'
import { completedLessonIds, isEnrolled } from './learning'
import { passedQuizModules } from './quiz'

// Sem letras e números que se confundem (0/O, 1/I/L)
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

function newCode() {
  const chars = [...randomBytes(12)].map((byte) => ALPHABET.charAt(byte % ALPHABET.length)).join('')
  return `${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8)}`
}

// Curso concluído = todas as aulas marcadas e todos os quizzes aprovados
export async function courseCompletion(profileId: string, course: CourseOutline): Promise<CourseCompletion> {
  const lessonIds = course.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id))
  const quizModules = course.modules.filter((module) => module.quizQuestions > 0).map((module) => module.id)
  const [done, passed] = await Promise.all([
    completedLessonIds(profileId, lessonIds),
    passedQuizModules(profileId, quizModules),
  ])
  return {
    lessonsDone: done.size,
    lessonsTotal: lessonIds.length,
    quizzesPassed: passed.length,
    quizzesTotal: quizModules.length,
    complete: lessonIds.length > 0 && done.size === lessonIds.length && passed.length === quizModules.length,
  }
}

export async function certificateCodeFor(profileId: string, courseId: number) {
  const [row] = await db()
    .select({ code: certificates.code })
    .from(certificates)
    .where(and(eq(certificates.profileId, profileId), eq(certificates.courseId, courseId)))
    .limit(1)
  return row?.code ?? null
}

type Student = { id: string; name: string; email: string; role: Role }

// Emite (ou devolve o que já existe) quando o curso está concluído; null se ainda não está
export async function issueCertificate(student: Student, slug: string) {
  const course = await getCourseBySlug(slug)
  if (!course?.published || !(await isEnrolled(student.id, course.id))) return null
  const existing = await certificateCodeFor(student.id, course.id)
  if (existing) return { code: existing, created: false, courseTitle: course.title }
  if (!(await courseCompletion(student.id, course)).complete) return null

  const [created] = await db()
    .insert(certificates)
    .values({
      code: newCode(),
      profileId: student.id,
      courseId: course.id,
      studentName: student.name.trim() || student.email,
      courseTitle: course.title,
      totalMinutes: course.totalMinutes,
    })
    .onConflictDoNothing()
    .returning({ code: certificates.code })
  if (created) return { code: created.code, created: true, courseTitle: course.title }
  const code = await certificateCodeFor(student.id, course.id)
  return code ? { code, created: false, courseTitle: course.title } : null
}

export async function getCertificate(code: string): Promise<Certificate | null> {
  const [row] = await db()
    .select({
      code: certificates.code,
      profileId: certificates.profileId,
      studentName: certificates.studentName,
      courseTitle: certificates.courseTitle,
      courseSlug: courses.slug,
      totalMinutes: certificates.totalMinutes,
      startedAt: enrollments.createdAt,
      issuedAt: certificates.issuedAt,
    })
    .from(certificates)
    .leftJoin(courses, eq(courses.id, certificates.courseId))
    .leftJoin(
      enrollments,
      and(eq(enrollments.profileId, certificates.profileId), eq(enrollments.courseId, certificates.courseId)),
    )
    .where(eq(certificates.code, code.toUpperCase()))
    .limit(1)
  return row ?? null
}

// Código do certificado de cada curso que a pessoa já concluiu (courseId -> código)
export async function certificateCodesByCourse(profileId: string) {
  const rows = await db()
    .select({ courseId: certificates.courseId, code: certificates.code })
    .from(certificates)
    .where(eq(certificates.profileId, profileId))
  return new Map(rows.map((row) => [row.courseId, row.code]))
}

// Certificados da pessoa, do mais recente para o mais antigo
export async function listMyCertificates(profileId: string): Promise<MyCertificate[]> {
  return db()
    .select({
      code: certificates.code,
      courseTitle: certificates.courseTitle,
      courseSlug: courses.slug,
      totalMinutes: certificates.totalMinutes,
      issuedAt: certificates.issuedAt,
    })
    .from(certificates)
    .leftJoin(courses, eq(courses.id, certificates.courseId))
    .where(eq(certificates.profileId, profileId))
    .orderBy(desc(certificates.issuedAt))
}
