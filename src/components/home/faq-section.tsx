import { Container } from '@/components/ui/container'
import { PlusIcon } from '@/components/ui/icons'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { SectionHeading } from '@/components/ui/section-heading'
import type { FaqContent } from '@/types/home'

export function FaqSection({ content }: { content: FaqContent }) {
  return (
    <section id="duvidas" className="bg-sage-light/10 py-20 lg:py-32">
      <Container>
        <RevealOnScroll className="mx-auto max-w-3xl">
          <SectionHeading eyebrow={content.eyebrow} title={content.title} />
          <div className="mt-12 flex flex-col gap-3">
            {content.items.map((item, index) => (
              <details
                key={item.question}
                name="faq"
                open={index === 0}
                data-reveal-item
                className="group rounded-3xl bg-paper px-6 shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <PlusIcon className="size-5 shrink-0 text-sage transition-transform group-open:rotate-45" />
                </summary>
                <p className="pb-6 text-ink/70">{item.answer}</p>
              </details>
            ))}
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  )
}
