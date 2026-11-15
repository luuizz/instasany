import { ButtonLink } from '@/components/ui/button'
import { CheckIcon } from '@/components/ui/icons'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Plan } from '@/types/home'

type PlanCardProps = { plan: Plan; href: string }

export function PlanCard({ plan, href }: PlanCardProps) {
  const featured = plan.highlight
  return (
    <article
      data-reveal-item
      className={cn(
        'relative flex flex-col gap-6 rounded-3xl p-6 lg:p-8',
        featured
          ? 'bg-paper text-ink shadow-2xl shadow-ink/40 lg:-my-4 lg:py-12'
          : 'border border-pine-line text-paper',
      )}
    >
      {featured && (
        <span className="absolute -top-3 left-6 rounded-full bg-lime px-3 py-1 text-xs font-bold text-pine">
          Mais escolhido
        </span>
      )}
      <div>
        <h3 className="text-2xl font-semibold">{plan.name}</h3>
        <p className={cn('mt-2 text-sm', featured ? 'text-ink/60' : 'text-paper/60')}>{plan.description}</p>
      </div>
      <div>
        {plan.compareAt !== null && plan.compareAt > plan.price && (
          <p className={cn('text-sm line-through', featured ? 'text-ink/50' : 'text-paper/50')}>
            <span className="sr-only">De </span>
            {formatPrice(plan.compareAt)}
          </p>
        )}
        <p className="text-5xl font-semibold">
          <span className="sr-only">por </span>
          {formatPrice(plan.price)}
        </p>
        <p className={cn('mt-1 text-sm', featured ? 'text-ink/60' : 'text-paper/60')}>{plan.period}</p>
      </div>
      <ul className="flex flex-1 flex-col gap-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm">
            <CheckIcon className={cn('mt-0.5 size-4 shrink-0', featured ? 'text-sage' : 'text-lime')} />
            {feature}
          </li>
        ))}
      </ul>
      <ButtonLink
        href={href}
        className={cn(
          'w-full',
          !featured && 'bg-transparent text-paper ring-1 ring-sage hover:bg-pine-line hover:brightness-100',
        )}
      >
        {plan.ctaLabel}
      </ButtonLink>
    </article>
  )
}
