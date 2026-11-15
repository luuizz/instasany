import { EyeIcon } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ActionsMenu } from '@/components/admin/actions-menu'
import { LessonForm } from '@/components/admin/lesson-form'
import { PageHeader } from '@/components/admin/page-header'
import { ButtonLink } from '@/components/ui/button'
import { isStorageConfigured } from '@/server/integrations/storage'
import { getLesson } from '@/server/services/course-admin'
import { getCourseById } from '@/server/services/courses'
import { deleteLessonAction, saveLessonAction } from '../../../actions'

type PageProps = { params: Promise<{ id: string; aula: string }> }

async function load(params: PageProps['params']) {
  const { id, aula } = await params
  const lesson = await getLesson(Number(aula))
  if (!lesson || lesson.courseId !== Number(id)) return null
  const course = await getCourseById(lesson.courseId)
  return course ? { lesson, course } : null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return { title: (await load(params))?.lesson.title ?? 'Aula' }
}

export default async function EditLessonPage({ params }: PageProps) {
  const loaded = await load(params)
  if (!loaded) notFound()
  const { lesson, course } = loaded
  const moduleIndex = course.modules.findIndex((module) => module.id === lesson.moduleId)
  const lessonModule = course.modules[moduleIndex]
  const lessonIndex = lessonModule?.lessons.findIndex((item) => item.id === lesson.id) ?? -1

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { href: '/admin', label: 'Painel' },
          { href: '/admin/cursos', label: 'Cursos' },
          { href: `/admin/cursos/${course.id}`, label: course.title },
        ]}
        title={lesson.title}
        description={`Módulo ${moduleIndex + 1}${lessonModule ? ` · ${lessonModule.title}` : ''} · aula ${lessonIndex + 1} · ${lesson.durationMinutes} min${lesson.videoUrl ? ' · com vídeo' : ''}`}
        actions={
          <>
            <ButtonLink href={`/aluno/cursos/${course.slug}/aulas/${lesson.id}`} variant="outline" size="default">
              <EyeIcon />
              Ver como aluno
            </ButtonLink>
            <ActionsMenu
              links={[]}
              danger={{
                label: 'Excluir aula',
                title: `Excluir a aula "${lesson.title}"?`,
                description: 'O vídeo enviado e o progresso dos alunos nesta aula também saem.',
                run: deleteLessonAction.bind(null, lesson.id, lesson.courseId),
              }}
            />
          </>
        }
      />
      <LessonForm
        lesson={lesson}
        save={saveLessonAction.bind(null, lesson.id, lesson.courseId)}
        uploadsEnabled={isStorageConfigured()}
      />
    </div>
  )
}
