import { CalendarDaysIcon, PlayCircleIcon, StarIcon, UsersRoundIcon, type LucideIcon } from 'lucide-react'
import { CountUp } from '@/components/ui/count-up'
import { cn } from '@/lib/utils'
import type { AboutContent } from '@/types/home'

type Stat = AboutContent['stats'][number]

// O conteúdo vem do painel (2 a 4 números); a posição define o ícone
const icons: LucideIcon[] = [UsersRoundIcon, PlayCircleIcon, StarIcon, CalendarDaysIcon]
const columns: Record<number, string> = { 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' }

// Detalhe abaixo do número: estrelas para nota até 5, "há N anos" para um ano
function Detail({ value }: { value: string }) {
  const rating = Number(value.replace(',', '.'))
  if (value.includes(',') && rating > 0 && rating <= 5) {
    return (
      <span aria-hidden className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={cn('size-3.5', star <= Math.round(rating) ? 'fill-pine text-pine' : 'text-pine/30')}
          />
        ))}
      </span>
    )
  }
  if (/^(19|20)\d{2}$/.test(value)) {
    const years = new Date().getFullYear() - Number(value)
    return (
      <span className="self-start rounded-full bg-pine px-2.5 py-0.5 text-xs font-semibold text-lime">
        há {years} {years === 1 ? 'ano' : 'anos'}
      </span>
    )
  }
  return null
}

// Faixa de números da seção "Sobre nós", com contagem ao entrar na tela
export function AboutStats({ stats }: { stats: Stat[] }) {
  return (
    <ul className={cn('grid grid-cols-2 gap-4', columns[stats.length])}>
      {stats.map((stat, index) => {
        const Icon = icons[index % icons.length] ?? StarIcon
        const highlight = index === 0
        return (
          <li
            key={stat.label}
            data-reveal-item
            className={cn(
              'flex flex-col gap-3 rounded-3xl p-5 sm:p-6',
              highlight ? 'bg-lime text-pine' : 'bg-paper ring-1 ring-ink/10',
            )}
          >
            <span
              className={cn(
                'flex size-10 items-center justify-center rounded-2xl',
                highlight ? 'bg-pine text-lime' : 'bg-secondary text-pine',
              )}
            >
              <Icon className="size-5" />
            </span>
            <p className={cn('order-last text-sm', highlight ? 'text-pine/75' : 'text-ink/65')}>{stat.label}</p>
            <div className="flex flex-col gap-2">
              <CountUp
                value={stat.value}
                className="text-4xl font-semibold tracking-tight text-ink tabular-nums lg:text-5xl"
              />
              <Detail value={stat.value} />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
