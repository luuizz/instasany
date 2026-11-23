import { Container } from '@/components/ui/container'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { SectionHeading } from '@/components/ui/section-heading'
import { TouchScroll } from '@/components/ui/touch-scroll'
import { cn } from '@/lib/utils'
import type { PricingContent } from '@/types/home'
import { PlanCard } from './plan-card'

const columns: Record<number, string> = {
  1: 'lg:grid-cols-1 lg:max-w-md',
  2: 'lg:grid-cols-2 lg:max-w-4xl',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
}

export function PricingSection({ content }: { content: PricingContent }) {
  return (
    <section id="precos" className="bg-pine bg-hero bg-center bg-no-repeat py-20 lg:py-32">
      <Container>
        <RevealOnScroll>
          <SectionHeading eyebrow={content.eyebrow} title={content.title} tone="dark" />
          <TouchScroll
            className={cn(
              'mt-8 pt-4 md:mx-auto md:mt-12 md:grid md:grid-cols-2 md:gap-6 lg:mt-20',
              columns[content.plans.length],
            )}
          >
            {content.plans.map((plan) => (
              <PlanCard key={plan.name} plan={plan} href={content.ctaHref} />
            ))}
          </TouchScroll>
          <p data-reveal-item className="mx-auto mt-12 max-w-2xl text-center text-sm text-paper/60">
            {content.note}
          </p>
        </RevealOnScroll>
      </Container>
    </section>
  )
}
