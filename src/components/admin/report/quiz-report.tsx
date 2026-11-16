import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { QuizReportItem } from '@/types/course-report'

// Desempenho de cada quiz do curso
export function QuizReport({ items }: { items: QuizReportItem[] }) {
  if (items.length === 0)
    return <p className="rounded-2xl bg-muted p-6 text-sm text-muted-foreground">Este curso ainda não tem quiz.</p>
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Módulo</TableHead>
          <TableHead className="text-right">Alunos</TableHead>
          <TableHead className="text-right">Tentativas</TableHead>
          <TableHead className="text-right">Aprovação</TableHead>
          <TableHead className="text-right">Média</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.moduleTitle}>
            <TableCell className="font-medium">{item.moduleTitle}</TableCell>
            <TableCell className="text-right tabular-nums">{item.students}</TableCell>
            <TableCell className="text-right tabular-nums">{item.attempts}</TableCell>
            <TableCell className="text-right tabular-nums">
              {item.students ? `${Math.round((item.passed / item.students) * 100)}%` : '—'}
            </TableCell>
            <TableCell className="text-right tabular-nums">{item.attempts ? `${item.averagePercent}%` : '—'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
