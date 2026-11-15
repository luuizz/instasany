import type { Metadata } from 'next'
import { CourseForm } from '@/components/admin/course-form'
import { PageHeader } from '@/components/admin/page-header'
import { isStorageConfigured } from '@/server/integrations/storage'
import { saveCourseAction } from '../actions'

export const metadata: Metadata = { title: 'Novo curso' }

export default function NewCoursePage() {
  return (
    <div className="max-w-3xl">
      <PageHeader title="Novo curso" back={{ href: '/admin/cursos', label: 'Cursos' }} />
      <CourseForm save={saveCourseAction.bind(null, null)} uploadsEnabled={isStorageConfigured()} />
    </div>
  )
}
