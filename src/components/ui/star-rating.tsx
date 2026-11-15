import { StarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type StarRatingProps = { value: number; className?: string; starClassName?: string }

// Nota de 0 a 5 em estrelas (meia estrela arredonda para a mais próxima)
export function StarRating({ value, className, starClassName }: StarRatingProps) {
  const rounded = Math.round(value)
  return (
    <span
      role="img"
      aria-label={`${value.toFixed(1).replace('.', ',')} de 5 estrelas`}
      className={cn('flex gap-0.5', className)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          aria-hidden
          className={cn(
            'size-4',
            star <= rounded ? 'fill-lime text-lime' : 'fill-transparent text-current opacity-30',
            starClassName,
          )}
        />
      ))}
    </span>
  )
}
