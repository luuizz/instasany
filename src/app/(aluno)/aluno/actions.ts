'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireUser } from '@/server/auth/session'
import { setLessonCompleted } from '@/server/services/learning'

type Target = { slug: string; lessonId: number; nextId: number | null }

// Marca ou desmarca a aula; ao concluir, segue para a próxima quando houver
export async function toggleLessonAction(target: Target, completed: boolean) {
  const profile = await requireUser()
  const changed = await setLessonCompleted(profile, target.lessonId, completed)
  if (!changed) redirect('/aluno')
  revalidatePath('/aluno')
  revalidatePath(`/aluno/cursos/${target.slug}`, 'layout')
  if (completed && target.nextId) redirect(`/aluno/cursos/${target.slug}/aulas/${target.nextId}`)
}
