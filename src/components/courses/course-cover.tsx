import Image from 'next/image'
import { cn } from '@/lib/utils'

type CourseCoverProps = { title: string; coverUrl: string | null; className?: string }

// Capa do curso; sem imagem, um bloco na identidade da marca com a inicial do curso
export function CourseCover({ title, coverUrl, className }: CourseCoverProps) {
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
          <span className="flex size-16 items-center justify-center rounded-full bg-lime text-3xl font-bold text-pine">
            {title.trim()[0]?.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  )
}
