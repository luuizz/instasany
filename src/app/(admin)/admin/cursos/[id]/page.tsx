import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CourseForm } from '@/components/admin/course-form'
import { CourseModules } from '@/components/admin/course-modules'
import { PageHeader } from '@/components/admin/page-header'
import { isStorageConfigured } from '@/server/integrations/storage'
import { ConfirmButton } from '@/components/ui/confirm-button'
import { getCourseById } from '@/server/services/courses'
import { deleteCourseAction, saveCourseAction } from '../actions'

type PageProps = { params: Promise<{ id: string }> }

const loadCourse = async (params: PageProps['params']) => {
  const id = Number((await params).id)
  return Number.isInteger(id) ? getCourseById(id) : null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return { title: (await loadCourse(params))?.title ?? 'Curso' }
}

export default async function EditCoursePage({ params }: PageProps) {
  const course = await loadCourse(params)
  if (!course) notFound()
  const firstLesson = course.modules.flatMap((module) => module.lessons)[0]

  return (
    <div className="max-w-5xl">
      <PageHeader
        title={course.title}
        back={{ href: '/admin/cursos', label: 'Cursos' }}
        actions={
          <>
            {firstLesson && (
              <Link
                href={`/aluno/cursos/${course.slug}/aulas/${firstLesson.id}`}
                className="text-sm font-semibold text-pine hover:underline"
              >
                Ver como aluno
              </Link>
            )}
            <form action={deleteCourseAction.bind(null, course.id)}>
              <ConfirmButton
                message={`Excluir o curso "${course.title}"? Aulas, matrículas e progresso também saem.`}
                className="text-sm font-semibold text-red-700 hover:underline"
              >
                Excluir curso
              </ConfirmButton>
            </form>
          </>
        }
      />
      <div className="grid gap-10 xl:grid-cols-2">
        <section>
          <h2 className="mb-4 text-lg font-semibold">Dados do curso</h2>
          <CourseForm
            course={course}
            save={saveCourseAction.bind(null, course.id)}
            uploadsEnabled={isStorageConfigured()}
          />
        </section>
        <section>
          <h2 className="mb-4 text-lg font-semibold">Módulos e aulas</h2>
          <CourseModules course={course} />
        </section>
      </div>
    </div>
  )
}
