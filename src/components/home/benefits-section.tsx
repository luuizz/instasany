import { Container } from '@/components/ui/container'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { SectionHeading } from '@/components/ui/section-heading'
import { TouchScroll, touchScrollItem } from '@/components/ui/touch-scroll'
import { cn } from '@/lib/utils'
import type { BenefitsContent } from '@/types/home'

export function BenefitsSection({ content }: { content: BenefitsContent }) {
  return (
    <section id="beneficios" className="bg-pine py-20 lg:py-32">
      <Container>
        <RevealOnScroll>
          <SectionHeading eyebrow={content.eyebrow} title={content.title} tone="dark" />
          <TouchScroll as="ol" className="mt-12 md:grid md:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-6">
            {content.items.map((item, index) => (
              <li
                key={item.title}
                data-reveal-item
                className={cn(
                  touchScrollItem,
                  'flex flex-col gap-4 rounded-3xl border border-pine-line p-6 transition-colors hover:border-sage lg:p-8',
                )}
              >
                <span className="text-sm font-bold text-lime">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="text-xl font-semibold text-paper">{item.title}</h3>
                <p className="text-paper/60">{item.text}</p>
              </li>
            ))}
          </TouchScroll>
        </RevealOnScroll>
      </Container>
    </section>
  )
}
