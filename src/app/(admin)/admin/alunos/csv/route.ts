import { csvResponse, toCsv } from '@/lib/csv'
import { ROLE_LABELS } from '@/lib/roles'
import { requireAdmin } from '@/server/auth/session'
import { exportStudents } from '@/server/services/students'

// Planilha com todas as pessoas cadastradas (só admin)
export async function GET() {
  await requireAdmin('/admin/alunos')
  const rows = await exportStudents()
  const csv = toCsv(rows, [
    { header: 'Nome', value: (row) => row.name },
    { header: 'E-mail', value: (row) => row.email },
    { header: 'Papel', value: (row) => ROLE_LABELS[row.role] },
    { header: 'Cadastro', value: (row) => row.createdAt },
    { header: 'Última atividade', value: (row) => row.lastActivity },
    { header: 'Cursos', value: (row) => row.courses },
    { header: 'Aulas concluídas', value: (row) => row.completedLessons },
    { header: 'Certificados', value: (row) => row.certificates },
  ])
  return csvResponse(csv, `alunos-${new Date().toISOString().slice(0, 10)}.csv`)
}
