import { cn } from '@/lib/utils'

type FieldProps = { label: string; hint?: string; children: React.ReactNode; className?: string }

export function Field({ label, hint, children, className }: FieldProps) {
  return (
    <label className={cn('flex flex-col gap-2', className)}>
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="text-xs text-current/60">{hint}</span>}
    </label>
  )
}

const control =
  'w-full rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-ink outline-none transition placeholder:text-ink/40 focus:border-sage focus:ring-4 focus:ring-sage/20'

export function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return <input className={cn(control, className)} {...props} />
}

export function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return <textarea className={cn(control, 'min-h-28 resize-y', className)} {...props} />
}

export function FormMessage({ tone = 'error', children }: { tone?: 'error' | 'success'; children?: React.ReactNode }) {
  if (!children) return null
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'rounded-2xl px-4 py-3 text-sm font-medium',
        tone === 'error' ? 'bg-red-50 text-red-700' : 'bg-lime/30 text-pine',
      )}
    >
      {children}
    </p>
  )
}
