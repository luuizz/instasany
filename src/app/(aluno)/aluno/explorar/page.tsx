import type { Metadata } from 'next'
import { CourseCatalog } from '@/components/courses/course-catalog'
import { StudentPageHeader } from '@/components/student/student-page-header'
import { requireUser } from '@/server/auth/session'
import { listCatalog } from '@/server/services/courses'
import { getStudentDashboard } from '@/server/services/student-dashboard'

export const metadata: Metadata = { title: 'Explorar cursos' }

// Catálogo dentro da área do aluno: mesma busca do site, mas os cards abrem a prévia aqui dentro
export default async function ExplorePage() {
  const profile = await requireUser('/aluno/explorar')
  const [catalog, { courses }] = await Promise.all([listCatalog(), getStudentDashboard(profile.id)])

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <StudentPageHeader
        eyebrow="Área do aluno"
        title="Explorar cursos"
        description="Todos os cursos da Instasany. São gratuitos: escolha um e comece agora."
      />
      <CourseCatalog courses={catalog} hrefBase="/aluno/explorar" enrolledIds={courses.map((course) => course.id)} />
    </div>
  )
}
