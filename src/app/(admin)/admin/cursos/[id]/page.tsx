import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CourseForm } from '@/components/admin/course-form'
import { CourseModules } from '@/components/admin/course-modules'
import { PageHeader } from '@/components/admin/page-header'
import { isStorageConfigured } from '@/server/integrations/storage'
import { ConfirmButton } from '@/components/ui/confirm-dialog'
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
    <div>
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
                title={`Excluir o curso "${course.title}"?`}
                description="Módulos, aulas, matrículas e progresso dos alunos também saem. Não dá para desfazer."
                className="text-sm font-semibold text-red-700 hover:underline"
              >
                Excluir curso
              </ConfirmButton>
            </form>
          </>
        }
      />
      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
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
