import { cn } from '@/lib/utils'
import { Input } from './input'
import { Textarea } from './textarea'

export { Input, Textarea }

type FieldProps = { label: string; hint?: string; children: React.ReactNode; className?: string }

// Rótulo + controle + dica; o <label> envolve o controle, então não precisa de htmlFor
export function Field({ label, hint, children, className }: FieldProps) {
  return (
    <label className={cn('flex flex-col gap-2', className)}>
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </label>
  )
}

export function FormMessage({ tone = 'error', children }: { tone?: 'error' | 'success'; children?: React.ReactNode }) {
  if (!children) return null
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'animate-in rounded-2xl px-4 py-3 text-sm font-medium duration-200 fade-in slide-in-from-top-1',
        tone === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-lime/30 text-pine',
      )}
    >
      {children}
    </p>
  )
}
