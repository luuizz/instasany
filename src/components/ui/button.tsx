import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import { Slot } from 'radix-ui'
import { cn } from '@/lib/utils'

// Botão do shadcn/ui com as variantes da marca: pílula lima como ação principal
const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-all duration-200 outline-none focus-visible:ring-4 focus-visible:ring-ring/40 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary font-bold text-primary-foreground hover:brightness-95',
        dark: 'bg-pine text-paper hover:bg-pine-line',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
        outline: 'border border-input bg-background hover:border-sage hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        destructive: 'text-destructive hover:bg-destructive/10',
        destructiveSolid: 'bg-destructive text-paper hover:bg-destructive/90',
        link: 'rounded-none px-0 text-pine underline-offset-4 hover:underline',
        // Sobre fundo verde-pinho (site)
        onDark: 'font-medium text-paper hover:text-lime',
        outlineOnDark: 'text-paper ring-1 ring-sage hover:bg-pine-line',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        default: 'h-11 px-5 text-sm',
        lg: 'h-14 px-6 text-base',
        icon: 'size-10',
        'icon-sm': 'size-8',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

type ButtonVariants = VariantProps<typeof buttonVariants>

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & ButtonVariants & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'button'
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

// Link com cara de botão; no site o tamanho padrão é o grande
function ButtonLink({ className, variant, size = 'lg', ...props }: React.ComponentProps<typeof Link> & ButtonVariants) {
  return <Link className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, ButtonLink, buttonVariants }
