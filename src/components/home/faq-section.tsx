import { Container } from '@/components/ui/container'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { SectionHeading } from '@/components/ui/section-heading'
import type { FaqContent } from '@/types/home'

export function FaqSection({ content }: { content: FaqContent }) {
  return (
    <section id="duvidas" className="bg-sage-light/10 py-20 lg:py-32">
      <Container>
        <RevealOnScroll className="mx-auto max-w-3xl">
          <SectionHeading eyebrow={content.eyebrow} title={content.title} />
          <Accordion type="single" collapsible defaultValue="item-0" className="mt-12 flex flex-col gap-3">
            {content.items.map((item, index) => (
              <AccordionItem
                key={item.question}
                value={`item-${index}`}
                data-reveal-item
                className="rounded-3xl border-none bg-paper px-6 shadow-sm"
              >
                <AccordionTrigger className="cursor-pointer py-5 text-base font-semibold text-ink hover:no-underline [&>svg]:size-5 [&>svg]:text-sage">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base text-ink/70">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </RevealOnScroll>
      </Container>
    </section>
  )
}
