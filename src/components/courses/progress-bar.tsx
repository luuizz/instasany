import { Progress } from '@/components/ui/progress'

type ProgressBarProps = { done: number; total: number }

// Progresso do curso (Progress do shadcn) com a porcentagem ao lado
export function ProgressBar({ done, total }: ProgressBarProps) {
  const percent = total ? Math.round((done / total) * 100) : 0
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <Progress value={percent} aria-label="Progresso do curso" className="flex-1" />
      <span className="shrink-0 font-semibold tabular-nums">{percent}%</span>
    </div>
  )
}
