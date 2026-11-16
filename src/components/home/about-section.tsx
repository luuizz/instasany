import { Container } from '@/components/ui/container'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { SectionHeading } from '@/components/ui/section-heading'
import type { AboutContent } from '@/types/home'
import { AboutStats } from './about-stats'
import { ProductBento } from './product/product-bento'

// Sobre nós: texto do painel, prévias animadas da plataforma e os números
export function AboutSection({ content }: { content: AboutContent }) {
  return (
    <section id="sobre" className="py-20 lg:py-32">
      <Container>
        <RevealOnScroll className="flex flex-col gap-12 lg:gap-16">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
            <SectionHeading eyebrow={content.eyebrow} title={content.title} align="left" className="lg:col-span-6" />
            <div className="flex flex-col gap-4 lg:col-span-6">
              {content.paragraphs.map((paragraph) => (
                <p key={paragraph} data-reveal-item className="text-lg text-ink/70">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <ProductBento />
          <AboutStats stats={content.stats} />
        </RevealOnScroll>
      </Container>
    </section>
  )
}
