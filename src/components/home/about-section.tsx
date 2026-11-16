import { Container } from '@/components/ui/container'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { SectionHeading } from '@/components/ui/section-heading'
import type { AboutContent } from '@/types/home'
import { AboutStats } from './about-stats'

export function AboutSection({ content }: { content: AboutContent }) {
  return (
    <section id="sobre" className="py-20 lg:py-32">
      <Container>
        <RevealOnScroll className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-6">
            <SectionHeading eyebrow={content.eyebrow} title={content.title} align="left" />
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph} data-reveal-item className="text-lg text-ink/70">
                {paragraph}
              </p>
            ))}
          </div>
          <AboutStats stats={content.stats} />
        </RevealOnScroll>
      </Container>
    </section>
  )
}
