import Image from 'next/image'
import { cn } from '@/lib/utils'

type CourseCoverProps = { title: string; coverUrl: string | null; compact?: boolean; className?: string }

// Capa do curso; sem imagem, uma arte na identidade da marca (brilho, grade e a inicial do curso)
export function CourseCover({ title, coverUrl, compact, className }: CourseCoverProps) {
  return (
    <div className={cn('relative aspect-video overflow-hidden rounded-3xl bg-pine', className)}>
      {coverUrl ? (
        <Image
          src={coverUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 400px, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
          unoptimized
        />
      ) : (
        <div aria-hidden className="absolute inset-0 flex items-center justify-center cover-art">
          <span
            className={cn(
              'relative flex items-center justify-center rounded-2xl bg-lime font-bold text-pine shadow-lg shadow-ink/30 transition duration-500 group-hover:scale-110 group-hover:-rotate-6',
              compact ? 'size-7 rounded-lg text-sm' : 'size-16 text-3xl',
            )}
          >
            {title.trim()[0]?.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  )
}
