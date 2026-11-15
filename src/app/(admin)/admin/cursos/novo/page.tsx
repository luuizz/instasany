import { requireAdmin } from '@/server/auth/session'
import type { Metadata } from 'next'
import { CourseForm } from '@/components/admin/course-form'
import { PageHeader } from '@/components/admin/page-header'
import { isStorageConfigured } from '@/server/integrations/storage'
import { saveCourseAction } from '../actions'

export const metadata: Metadata = { title: 'Novo curso' }

export default async function NewCoursePage() {
  await requireAdmin('/admin/cursos/novo')
  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Novo curso"
        breadcrumbs={[
          { href: '/admin', label: 'Painel' },
          { href: '/admin/cursos', label: 'Cursos' },
        ]}
        description="Comece pelos dados do curso; módulos e aulas vêm em seguida."
      />
      <CourseForm save={saveCourseAction.bind(null, null)} uploadsEnabled={isStorageConfigured()} />
    </div>
  )
}
