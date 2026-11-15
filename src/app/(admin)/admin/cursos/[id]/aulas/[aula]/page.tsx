import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LessonForm } from '@/components/admin/lesson-form'
import { PageHeader } from '@/components/admin/page-header'
import { isStorageConfigured } from '@/server/integrations/storage'
import { ConfirmButton } from '@/components/ui/confirm-button'
import { getLesson } from '@/server/services/course-admin'
import { deleteLessonAction, saveLessonAction } from '../../../actions'

type PageProps = { params: Promise<{ id: string; aula: string }> }

async function load(params: PageProps['params']) {
  const { id, aula } = await params
  const lesson = await getLesson(Number(aula))
  return lesson && lesson.courseId === Number(id) ? lesson : null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return { title: (await load(params))?.title ?? 'Aula' }
}

export default async function EditLessonPage({ params }: PageProps) {
  const lesson = await load(params)
  if (!lesson) notFound()

  return (
    <div className="max-w-2xl">
      <PageHeader
        title={lesson.title}
        back={{ href: `/admin/cursos/${lesson.courseId}`, label: 'Voltar ao curso' }}
        actions={
          <form action={deleteLessonAction.bind(null, lesson.id, lesson.courseId)}>
            <ConfirmButton
              message={`Excluir a aula "${lesson.title}"?`}
              className="text-sm font-semibold text-red-700 hover:underline"
            >
              Excluir aula
            </ConfirmButton>
          </form>
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
