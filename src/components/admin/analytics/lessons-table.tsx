import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { LessonEngagement } from '@/types/analytics'

// Aulas com mais engajamento no período (tempo assistido, alunos e conclusões)
export function LessonsTable({ lessons }: { lessons: LessonEngagement[] }) {
  if (lessons.length === 0) {
    return <p className="rounded-2xl bg-muted p-6 text-sm text-muted-foreground">Nenhuma aula assistida no período.</p>
  }
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Aula</TableHead>
          <TableHead className="text-right">Alunos</TableHead>
          <TableHead className="text-right">Minutos assistidos</TableHead>
          <TableHead className="text-right">Conclusões</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="tabular-nums">
        {lessons.map((lesson) => (
          <TableRow key={lesson.lessonId}>
            <TableCell>
              <span className="block font-medium text-ink">{lesson.title}</span>
              <span className="block text-xs text-muted-foreground">{lesson.courseTitle}</span>
            </TableCell>
            <TableCell className="text-right">{lesson.students}</TableCell>
            <TableCell className="text-right">{lesson.watchedMinutes}</TableCell>
            <TableCell className="text-right">{lesson.completions}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
