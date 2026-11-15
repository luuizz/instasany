import 'server-only'
import { and, asc, eq, sql } from 'drizzle-orm'
import type { LessonAttachment } from '@/types/lms'
import { db } from '../db/client'
import { lessonAttachments } from '../db/schema'

const columns = {
  id: lessonAttachments.id,
  title: lessonAttachments.title,
  url: lessonAttachments.url,
  sizeBytes: lessonAttachments.sizeBytes,
  contentType: lessonAttachments.contentType,
}

export async function listAttachments(lessonId: number): Promise<LessonAttachment[]> {
  return db()
    .select(columns)
    .from(lessonAttachments)
    .where(eq(lessonAttachments.lessonId, lessonId))
    .orderBy(asc(lessonAttachments.sortOrder), asc(lessonAttachments.id))
}

type NewAttachment = { title: string; url: string; sizeBytes: number; contentType: string }

// Novo material entra no fim da lista da aula
export async function addAttachment(lessonId: number, input: NewAttachment) {
  const [row] = await db()
    .insert(lessonAttachments)
    .values({
      ...input,
      lessonId,
      sortOrder: sql`(select coalesce(max(sort_order), -1) + 1 from lesson_attachments where lesson_id = ${lessonId})`,
    })
    .returning(columns)
  return row
}

// Devolve o endereço do arquivo removido, para apagá-lo do Blob
export async function removeAttachment(lessonId: number, attachmentId: number) {
  const [row] = await db()
    .delete(lessonAttachments)
    .where(and(eq(lessonAttachments.id, attachmentId), eq(lessonAttachments.lessonId, lessonId)))
    .returning({ url: lessonAttachments.url })
  return row?.url ?? null
}
