import Image from 'next/image'
import { cn } from '@/lib/utils'

type CourseCoverProps = { title: string; coverUrl: string | null; compact?: boolean; className?: string }

// Capa do curso; sem imagem, um bloco na identidade da marca com a inicial do curso
export function CourseCover({ title, coverUrl, compact, className }: CourseCoverProps) {
  return (
    <div className={cn('relative aspect-video overflow-hidden rounded-3xl bg-pine', className)}>
      {coverUrl ? (
        <Image
          src={coverUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 400px, 100vw"
          className="object-cover"
          unoptimized
        />
      ) : (
        <div aria-hidden className="flex h-full items-center justify-center bg-hero bg-cover bg-center">
          <span
            className={cn(
              'flex items-center justify-center rounded-full bg-lime font-bold text-pine',
              compact ? 'size-7 text-sm' : 'size-16 text-3xl',
            )}
          >
            {title.trim()[0]?.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  )
}
