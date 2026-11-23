import { cn } from '@/lib/utils'

type TouchScrollProps = React.HTMLAttributes<HTMLElement> & { as?: 'div' | 'ol' | 'ul' }

/**
 * Faixa com rolagem lateral pelo toque no celular, encostando nas bordas da tela (desfaz o padding do Container).
 * A partir do `md` o layout fica por conta de quem usa: passe `md:grid ...` no className.
 * Os filhos usam `touchScrollItem` para a largura e o encaixe.
 */
export function TouchScroll({ as: Tag = 'div', className, ...props }: TouchScrollProps) {
  return (
    <Tag
      className={cn(
        '-mx-4 scrollbar-none flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-6 sm:-mx-6 sm:scroll-px-6 sm:px-6',
        'md:mx-0 md:overflow-visible md:px-0 md:pb-0',
        className,
      )}
      {...props}
    />
  )
}

export const touchScrollItem = 'w-4/5 shrink-0 snap-center sm:w-3/5 md:w-auto'
