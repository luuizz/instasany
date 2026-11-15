type ProgressBarProps = { done: number; total: number }

export function ProgressBar({ done, total }: ProgressBarProps) {
  const percent = total ? Math.round((done / total) * 100) : 0
  return (
    <div className="flex items-center gap-3 text-sm text-ink/60">
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progresso do curso"
        className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10"
      >
        <div className="h-full rounded-full bg-sage transition-[width]" style={{ width: `${percent}%` }} />
      </div>
      <span className="shrink-0 font-semibold">{percent}%</span>
    </div>
  )
}
