import { cn } from '@/lib/utils'

export function Select({ className, ...props }: React.ComponentProps<'select'>) {
  return (
    <select
      className={cn(
        'w-full rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-ink outline-none focus:border-sage focus:ring-4 focus:ring-sage/20',
        className,
      )}
      {...props}
    />
  )
}
