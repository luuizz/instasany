import type { Metadata } from 'next'
import { CourseCollection } from '@/components/admin/course-collection'
import { PageHeader } from '@/components/admin/page-header'
import { ViewToggle } from '@/components/admin/view-toggle'
import { PlusIcon, SparklesIcon } from 'lucide-react'
import { Button, ButtonLink } from '@/components/ui/button'
import { getAdminView } from '@/server/admin-view'
import { listAllCourses } from '@/server/services/courses'
import { createDemoCoursesAction } from './actions'

export const metadata: Metadata = { title: 'Cursos' }

export default async function AdminCoursesPage() {
  const [courses, view] = await Promise.all([listAllCourses(), getAdminView()])
  const published = courses.filter((course) => course.published).length

  return (
    <div>
      <PageHeader
        title="Cursos"
        description={
          courses.length
            ? `${courses.length} cursos, ${published} publicados e ${courses.length - published} em rascunho.`
            : 'Cursos, módulos e aulas da área do aluno.'
        }
        actions={
          <>
            {courses.length > 0 && <ViewToggle view={view} />}
            <ButtonLink href="/admin/cursos/novo" size="default">
              <PlusIcon />
              Novo curso
            </ButtonLink>
          </>
        }
      />

      {courses.length === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded-3xl border border-dashed border-ink/20 p-8">
          <p className="text-ink/70">
            Nenhum curso ainda. Crie o primeiro ou comece com dois cursos de exemplo, já publicados.
          </p>
          <form action={createDemoCoursesAction}>
            <Button type="submit" variant="dark">
              <SparklesIcon />
              Criar cursos de exemplo
            </Button>
          </form>
        </div>
      ) : (
        <CourseCollection courses={courses} view={view} />
      )}
    </div>
  )
}
