import { redirect } from 'next/navigation'
import { requireUser } from '@/server/auth/session'
import { getCourseBySlug } from '@/server/services/courses'
import { firstPendingLesson, isEnrolled } from '@/server/services/learning'

type PageProps = { params: Promise<{ slug: string }> }

// Abre o curso na primeira aula ainda não concluída
export default async function StudentCoursePage({ params }: PageProps) {
  const { slug } = await params
  const profile = await requireUser(`/aluno/cursos/${slug}`)
  const course = await getCourseBySlug(slug)
  if (!course || (profile.role !== 'admin' && !(await isEnrolled(profile.id, course.id)))) redirect(`/cursos/${slug}`)
  const lessonId = await firstPendingLesson(profile.id, course)
  redirect(lessonId ? `/aluno/cursos/${slug}/aulas/${lessonId}` : `/cursos/${slug}`)
}
