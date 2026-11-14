import { cn } from '@/lib/utils'

type ContainerProps = React.ComponentProps<'div'>

// Largura máxima do conteúdo com respiro lateral
export function Container({ className, ...props }: ContainerProps) {
  return <div className={cn('mx-auto w-full max-w-grid px-4 sm:px-6', className)} {...props} />
}
