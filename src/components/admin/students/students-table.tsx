import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate, formatRelative } from '@/lib/dates'
import type { StudentListItem } from '@/types/students'
import { PersonCell } from './person-cell'
import { RoleBadge } from './role-badge'

const percent = (done: number, total: number) => (total ? Math.round((done / total) * 100) : 0)

// Lista do painel de alunos; a linha inteira leva ao detalhe pelo link do nome
export function StudentsTable({ students }: { students: StudentListItem[] }) {
  return (
    <div className="animate-in rounded-3xl border border-border bg-card duration-500 fade-in slide-in-from-bottom-2">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-6">Pessoa</TableHead>
            <TableHead>Papel</TableHead>
            <TableHead className="text-right">Cursos</TableHead>
            <TableHead className="w-48">Progresso</TableHead>
            <TableHead>Última atividade</TableHead>
            <TableHead className="pr-6">Cadastro</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => {
            const value = percent(student.completedLessons, student.totalLessons)
            return (
              <TableRow key={student.id} className="relative">
                <TableCell className="py-3 pl-6">
                  <Link
                    href={`/admin/alunos/${student.id}`}
                    className="block rounded-xl outline-none after:absolute after:inset-0 focus-visible:ring-4 focus-visible:ring-ring/30"
                  >
                    <PersonCell name={student.name} email={student.email} />
                  </Link>
                </TableCell>
                <TableCell>
                  <RoleBadge role={student.role} />
                </TableCell>
                <TableCell className="text-right tabular-nums">{student.courses}</TableCell>
                <TableCell>
                  {student.totalLessons ? (
                    <span className="flex items-center gap-3">
                      <Progress value={value} aria-label={`${value}% das aulas`} className="h-2" />
                      <span className="w-10 text-right text-sm tabular-nums">{value}%</span>
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Sem cursos</span>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {student.lastActivity ? formatRelative(student.lastActivity) : '—'}
                </TableCell>
                <TableCell className="pr-6 text-sm text-muted-foreground">
                  {student.createdAt ? formatDate(student.createdAt) : '—'}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
