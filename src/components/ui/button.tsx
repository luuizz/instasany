import Link from 'next/link'
import { cn } from '@/lib/utils'

type ButtonLinkProps = React.ComponentProps<typeof Link> & { variant?: 'primary' | 'ghost' }

const variants = {
  primary: 'rounded-full bg-lime px-5 py-4 font-bold text-pine hover:brightness-95',
  ghost: 'gap-2 font-medium text-paper hover:text-lime',
}

export function ButtonLink({ variant = 'primary', className, ...props }: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        'inline-flex items-center justify-center transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
