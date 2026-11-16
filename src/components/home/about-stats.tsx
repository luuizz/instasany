import { CalendarDaysIcon, PlayCircleIcon, StarIcon, UsersRoundIcon, type LucideIcon } from 'lucide-react'
import { CountUp } from '@/components/ui/count-up'
import { cn } from '@/lib/utils'
import type { AboutContent } from '@/types/home'

type Stat = AboutContent['stats'][number]

// Ícone e visual de cada posição do bento (o conteúdo vem do painel; a ordem define o desenho)
const tiles: { icon: LucideIcon; className: string }[] = [
  { icon: UsersRoundIcon, className: 'col-span-2 bg-pine text-paper' },
  { icon: PlayCircleIcon, className: 'bg-lime text-pine' },
  { icon: StarIcon, className: 'bg-secondary text-pine' },
  { icon: CalendarDaysIcon, className: 'col-span-2 bg-ink text-paper' },
]

const initials = ['M', 'J', 'C', 'R']

function Extra({ index, stat }: { index: number; stat: Stat }) {
  if (index === 0) {
    return (
      <span aria-hidden className="mt-6 flex items-center gap-3">
        <span className="flex -space-x-2">
          {initials.map((letter, i) => (
            <span
              key={letter}
              className={cn(
                'flex size-9 items-center justify-center rounded-full text-sm font-bold ring-2 ring-pine',
                i % 2 ? 'bg-sage-light text-pine' : 'bg-lime text-pine',
              )}
            >
              {letter}
            </span>
          ))}
        </span>
        <span className="text-sm text-paper/60">e uma comunidade que não para de crescer</span>
      </span>
    )
  }
  const rating = Number(stat.value.replace(',', '.'))
  if (index === 2 && rating > 0 && rating <= 5) {
    return (
      <span aria-hidden className="mt-4 flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={cn('size-4', star <= Math.round(rating) ? 'fill-pine text-pine' : 'text-pine/30')}
          />
        ))}
      </span>
    )
  }
  const year = Number(stat.value)
  if (index === 3 && year > 1900) {
    const years = new Date().getFullYear() - year
    return (
      <span className="mt-4 inline-flex self-start rounded-full bg-lime px-3 py-1 text-xs font-semibold text-pine">
        há {years} {years === 1 ? 'ano' : 'anos'}
      </span>
    )
  }
  return null
}

// Números da seção "Sobre nós" em bento: o primeiro em destaque, os outros com ícone e um detalhe
export function AboutStats({ stats }: { stats: Stat[] }) {
  return (
    <dl className="grid grid-cols-2 gap-3 self-center sm:gap-4">
      {stats.map((stat, index) => {
        const tile = tiles[index % tiles.length] ?? tiles[0]
        const Icon = tile?.icon ?? StarIcon
        const dark = index % tiles.length === 0 || index % tiles.length === 3
        return (
          <div
            key={stat.label}
            data-reveal-item
            className={cn(
              'relative isolate flex flex-col overflow-hidden rounded-3xl p-6 lg:p-8',
              tile?.className,
              stats.length % 2 === 1 && index === stats.length - 1 && 'col-span-2',
            )}
          >
            {index === 0 && <span aria-hidden className="absolute inset-0 -z-10 opacity-80 cover-art" />}
            <span
              className={cn(
                'relative order-first mb-6 flex size-11 items-center justify-center rounded-2xl',
                dark ? 'bg-paper/10 text-lime' : 'bg-paper/70 text-pine',
              )}
            >
              <Icon className="size-5" />
            </span>
            <dt className={cn('relative text-sm', dark ? 'text-paper/60' : 'text-pine/70')}>{stat.label}</dt>
            <dd
              className={cn(
                'relative -order-1 font-semibold tracking-tight tabular-nums',
                index === 0 ? 'text-6xl text-lime lg:text-7xl' : 'text-4xl lg:text-5xl',
                index % tiles.length === 3 && 'text-lime',
              )}
            >
              <CountUp value={stat.value} />
            </dd>
            <span className="relative flex flex-col">
              <Extra index={index % tiles.length} stat={stat} />
            </span>
          </div>
        )
      })}
    </dl>
  )
}
