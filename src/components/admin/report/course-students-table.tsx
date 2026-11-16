import { AwardIcon } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatRelative } from '@/lib/dates'
import type { CourseReportStudent } from '@/types/course-report'

const LIMIT = 50

// Alunos do curso, do mais ativo para o menos; a lista completa vai no CSV
export function CourseStudentsTable({ students }: { students: CourseReportStudent[] }) {
  if (students.length === 0)
    return <p className="rounded-2xl bg-muted p-6 text-sm text-muted-foreground">Ninguém matriculado ainda.</p>
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Aluno</TableHead>
            <TableHead className="w-48">Progresso</TableHead>
            <TableHead className="text-right">Última atividade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.slice(0, LIMIT).map((student) => {
            const percent = student.total ? Math.round((student.completed / student.total) * 100) : 0
            return (
              <TableRow key={student.email}>
                <TableCell>
                  <span className="flex items-center gap-2 font-medium">
                    {student.name || student.email}
                    {student.certificateCode && <AwardIcon aria-label="Com certificado" className="size-4 text-sage" />}
                  </span>
                  <span className="block text-xs text-muted-foreground">{student.email}</span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-2">
                    <Progress value={percent} className="h-1.5" aria-label={`${percent}%`} />
                    <span className="w-10 text-right text-xs tabular-nums">{percent}%</span>
                  </span>
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {student.lastActivity ? formatRelative(student.lastActivity) : '—'}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      {students.length > LIMIT && (
        <p className="mt-3 text-sm text-muted-foreground">
          Mostrando os {LIMIT} mais ativos de {students.length}. A lista completa está no CSV.
        </p>
      )}
    </>
  )
}
