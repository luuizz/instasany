import Image from 'next/image'
import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { CheckIcon } from 'lucide-react'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { SectionHeading } from '@/components/ui/section-heading'
import type { AudienceContent } from '@/types/home'

export function AudienceSection({ content }: { content: AudienceContent }) {
  return (
    <section id="para-quem" className="overflow-hidden py-20 lg:py-32">
      <Container>
        <RevealOnScroll className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div data-reveal-item aria-hidden className="relative mx-auto aspect-square w-full max-w-md lg:order-last">
            <div className="absolute inset-8 rounded-full bg-lime/40" />
            <Image
              src="/images/card-04.png"
              alt=""
              width={250}
              height={175}
              className="absolute top-6 left-0 w-3/5 -rotate-6 rounded-3xl shadow-xl"
            />
            <Image
              src="/images/card-02.png"
              alt=""
              width={250}
              height={175}
              className="absolute right-0 bottom-6 w-3/5 rotate-6 rounded-3xl shadow-xl"
            />
            <span className="absolute top-1/2 left-1/2 flex size-16 -translate-1/2 items-center justify-center rounded-full bg-pine text-lime shadow-lg">
              <CheckIcon className="size-8" />
            </span>
          </div>

          <div className="flex flex-col gap-8">
            <SectionHeading eyebrow={content.eyebrow} title={content.title} align="left">
              <p className="text-lg text-ink/70">{content.description}</p>
            </SectionHeading>
            <ul className="flex flex-col gap-3">
              {content.items.map((item) => (
                <li key={item} data-reveal-item className="flex items-start gap-3 text-ink">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-lime text-pine">
                    <CheckIcon className="size-4" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div data-reveal-item>
              <ButtonLink href={content.ctaHref}>{content.ctaLabel}</ButtonLink>
            </div>
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  )
}
