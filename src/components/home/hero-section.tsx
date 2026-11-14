'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import type { HeroContent } from '@/types/home'
import { useHeroAnimation } from './use-hero-animation'

type HeroSectionProps = { content: HeroContent }

export function HeroSection({ content }: HeroSectionProps) {
  const scope = useRef<HTMLElement>(null)
  useHeroAnimation(scope)

  return (
    <section
      ref={scope}
      id="inicio"
      className="relative overflow-hidden border-t border-pine-line bg-pine bg-hero bg-top bg-no-repeat pt-12 pb-84 sm:pb-100 lg:pt-16 lg:pb-128"
    >
      <Container className="flex flex-col items-center">
        <div data-reveal="hero-text" className="w-full max-w-hero-text text-center opacity-0">
          <p className="mb-4 font-medium text-sage sm:text-xl">{content.eyebrow}</p>
          <h1 className="mb-8 text-4xl/tight font-semibold text-balance text-paper sm:text-5xl/tight lg:text-7xl/tight">
            {content.title}
          </h1>
          <div className="flex flex-col-reverse items-center justify-center gap-6 sm:flex-row sm:gap-10">
            <ButtonLink href={content.waitlistHref} variant="ghost">
              <Image src="/icons/file.svg" alt="" width={24} height={25} />
              {content.waitlistLabel}
            </ButtonLink>
            <ButtonLink href={content.ctaHref}>{content.ctaLabel}</ButtonLink>
          </div>
        </div>

        <div aria-hidden className="relative mt-4 hidden h-28 w-full max-w-hero-hands lg:block">
          <Image src="/icons/hand.svg" alt="" width={59} height={59} className="absolute bottom-0 left-0" />
          <Image src="/icons/hand-02.svg" alt="" width={63} height={63} className="absolute top-0 right-0" />
        </div>

        <div aria-hidden className="absolute -bottom-44 hidden w-full max-w-hero-phones justify-between lg:flex">
          <Image
            data-reveal="phone-left"
            src="/images/phone-outline.svg"
            alt=""
            width={329}
            height={663}
            className="relative top-12.5 left-13"
          />
          <Image
            data-reveal="phone-right"
            src="/images/phone-outline.svg"
            alt=""
            width={329}
            height={663}
            className="relative top-12.5 right-13"
          />
        </div>
      </Container>
    </section>
  )
}
