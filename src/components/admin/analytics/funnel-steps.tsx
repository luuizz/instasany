import type { FunnelStep } from '@/types/analytics'

const number = new Intl.NumberFormat('pt-BR')

// Da visita à aula concluída; cada etapa mostra quanto da anterior seguiu adiante
export function FunnelSteps({ steps }: { steps: FunnelStep[] }) {
  const top = Math.max(steps[0]?.value ?? 0, 1)
  return (
    <ol className="flex flex-col gap-3">
      {steps.map((step, index) => {
        const previous = steps[index - 1]?.value
        const rate = previous ? Math.round((step.value / previous) * 100) : null
        return (
          <li key={step.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5">
            <span className="text-sm">
              <span className="font-medium text-ink">{step.label}</span>
              <span className="ml-2 text-xs text-muted-foreground">{step.detail}</span>
            </span>
            <span className="text-right text-sm tabular-nums">
              <span className="font-semibold">{number.format(step.value)}</span>
              {rate !== null && <span className="ml-2 text-xs text-muted-foreground">{rate}% da etapa anterior</span>}
            </span>
            <span className="col-span-2 h-3 overflow-hidden rounded-full bg-muted">
              <span
                className="block h-full rounded-full bg-pine"
                style={{ width: `${Math.max((step.value / top) * 100, step.value ? 2 : 0)}%` }}
              />
            </span>
          </li>
        )
      })}
    </ol>
  )
}
