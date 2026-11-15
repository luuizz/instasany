import { Container } from '@/components/ui/container'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { SectionHeading } from '@/components/ui/section-heading'
import { cn } from '@/lib/utils'
import type { AboutContent } from '@/types/home'

export function AboutSection({ content }: { content: AboutContent }) {
  return (
    <section id="sobre" className="py-20 lg:py-32">
      <Container>
        <RevealOnScroll className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-6">
            <SectionHeading eyebrow={content.eyebrow} title={content.title} align="left" />
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph} data-reveal-item className="text-lg text-ink/70">
                {paragraph}
              </p>
            ))}
          </div>
          <dl className="grid grid-cols-2 gap-4 self-center">
            {content.stats.map((stat, index) => (
              <div
                key={stat.label}
                data-reveal-item
                className={cn('flex flex-col gap-1 rounded-3xl p-6 lg:p-8', index % 3 === 0 ? 'bg-pine' : 'bg-lime/40')}
              >
                <dt className={index % 3 === 0 ? 'text-sm text-paper/60' : 'text-sm text-pine/70'}>{stat.label}</dt>
                <dd
                  className={
                    index % 3 === 0
                      ? 'order-first text-4xl font-semibold text-lime lg:text-5xl'
                      : 'order-first text-4xl font-semibold text-pine lg:text-5xl'
                  }
                >
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </RevealOnScroll>
      </Container>
    </section>
  )
}
