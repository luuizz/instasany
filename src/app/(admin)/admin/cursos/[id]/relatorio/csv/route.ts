import { notFound } from 'next/navigation'
import { csvResponse, toCsv } from '@/lib/csv'
import { requireStaff } from '@/server/auth/session'
import { listCourseStudents } from '@/server/services/course-report'
import { getCourseById } from '@/server/services/courses'

type Context = { params: Promise<{ id: string }> }

// Alunos de um curso com o progresso de cada um
export async function GET(_request: Request, { params }: Context) {
  await requireStaff()
  const course = await getCourseById(Number((await params).id))
  if (!course) notFound()
  const rows = await listCourseStudents(course.id)
  const csv = toCsv(rows, [
    { header: 'Nome', value: (row) => row.name },
    { header: 'E-mail', value: (row) => row.email },
    { header: 'Matrícula', value: (row) => row.enrolledAt },
    { header: 'Aulas concluídas', value: (row) => row.completed },
    { header: 'Total de aulas', value: (row) => row.total },
    { header: 'Progresso (%)', value: (row) => (row.total ? Math.round((row.completed / row.total) * 100) : 0) },
    { header: 'Última atividade', value: (row) => row.lastActivity },
    { header: 'Certificado', value: (row) => row.certificateCode },
  ])
  return csvResponse(csv, `${course.slug}-alunos.csv`)
}
