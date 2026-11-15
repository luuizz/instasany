'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { lessonPositionSchema } from '@/lib/validation/lms'
import { getCurrentProfile, requireUser } from '@/server/auth/session'
import { recordServerEvent } from '@/server/services/analytics'
import { saveLessonPosition, setLessonCompleted } from '@/server/services/learning'

type Target = { slug: string; lessonId: number; nextId: number | null }

// Marca ou desmarca a aula; ao concluir, segue para a próxima quando houver
export async function toggleLessonAction(target: Target, completed: boolean) {
  const profile = await requireUser()
  const changed = await setLessonCompleted(profile, target.lessonId, completed)
  if (!changed) redirect('/aluno')
  if (completed) after(() => recordServerEvent('lesson_complete', profile, { lessonId: target.lessonId }))
  revalidatePath('/aluno')
  revalidatePath(`/aluno/cursos/${target.slug}`, 'layout')
  if (completed && target.nextId) redirect(`/aluno/cursos/${target.slug}/aulas/${target.nextId}`)
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
