'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { fail, ok, type ActionResult } from '@/lib/result'
import { lessonNoteSchema, lessonPositionSchema } from '@/lib/validation/lms'
import { getCurrentProfile, requireUser } from '@/server/auth/session'
import { recordServerEvent } from '@/server/services/analytics'
import { saveLessonPosition, setLessonCompleted } from '@/server/services/learning'
import { saveNote } from '@/server/services/notes'

// nextHref: próxima aula ou o quiz do módulo, sempre dentro do curso
type Target = { slug: string; lessonId: number; nextHref: string | null }

// Marca ou desmarca a aula; ao concluir, segue para a próxima quando houver
export async function toggleLessonAction(target: Target, completed: boolean) {
  const profile = await requireUser()
  const changed = await setLessonCompleted(profile, target.lessonId, completed)
  if (!changed) redirect('/aluno')
  if (completed) after(() => recordServerEvent('lesson_complete', profile, { lessonId: target.lessonId }))
  revalidatePath('/aluno')
  revalidatePath(`/aluno/cursos/${target.slug}`, 'layout')
  if (completed && target.nextHref?.startsWith(`/aluno/cursos/${target.slug}/`)) redirect(target.nextHref)
}

// Posição do vídeo enviada pelo player; falha aqui nunca interrompe a aula
export async function saveLessonPositionAction(input: unknown): Promise<void> {
  const parsed = lessonPositionSchema.safeParse(input)
  if (!parsed.success) return
  try {
    const profile = await getCurrentProfile()
    if (profile) await saveLessonPosition(profile, parsed.data.lessonId, parsed.data.seconds)
  } catch (error) {
    console.error('[aula] não foi possível salvar a posição do vídeo:', error)
  }
}

// Anotação da aula, salva automaticamente pelo bloco de notas enquanto a pessoa digita
export async function saveNoteAction(input: unknown): Promise<ActionResult<{ savedAt: string }>> {
  const parsed = lessonNoteSchema.safeParse(input)
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? 'Não foi possível salvar a anotação.')
  const profile = await requireUser()
  const saved = await saveNote(profile, parsed.data.lessonId, parsed.data.content)
  if (!saved) return fail('Você precisa estar matriculado no curso para anotar.')
  revalidatePath('/aluno/anotacoes')
  return ok({ savedAt: saved.updatedAt.toISOString() })
}
