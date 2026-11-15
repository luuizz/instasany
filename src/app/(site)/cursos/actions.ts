'use server'

import { revalidatePath } from 'next/cache'
import { after } from 'next/server'
import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/server/auth/session'
import { recordServerEvent } from '@/server/services/analytics'
import { getPublishedCourse } from '@/server/services/courses'
import { enroll, firstPendingLesson } from '@/server/services/learning'

// Matricula e leva direto para a aula; sem login, passa pelo /entrar e volta para o curso
export async function enrollAction(slug: string) {
  const profile = await getCurrentProfile()
  if (!profile) redirect(`/entrar?volta=${encodeURIComponent(`/cursos/${slug}`)}`)
  const course = await getPublishedCourse(slug)
  if (!course) redirect('/cursos')

  if (await enroll(profile.id, course.id))
    after(() => recordServerEvent('enrollment', profile, { courseId: course.id }))
  revalidatePath('/aluno')
  const lessonId = await firstPendingLesson(profile.id, course)
  redirect(lessonId ? `/aluno/cursos/${slug}/aulas/${lessonId}` : '/aluno')
}
