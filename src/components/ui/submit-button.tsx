import { cn } from '@/lib/utils'

type SubmitButtonProps = React.ComponentProps<'button'> & { pending?: boolean; pendingLabel?: string }

export function SubmitButton({ children, pending = false, pendingLabel, className, ...props }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center rounded-full bg-lime px-6 py-4 font-bold text-pine transition hover:brightness-95 disabled:cursor-wait disabled:opacity-70',
        className,
      )}
      {...props}
    >
      {pending ? (pendingLabel ?? 'Enviando…') : children}
    </button>
  )
}
