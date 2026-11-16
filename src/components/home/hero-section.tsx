'use client'

import { ClipboardListIcon, HeartIcon, MessageCircleIcon } from 'lucide-react'
import Image from 'next/image'
import { useRef } from 'react'
import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import type { HeroContent } from '@/types/home'
import { FloatingBadge } from './floating-badge'
import { useHeroAnimation } from './use-hero-animation'

type HeroSectionProps = { content: HeroContent }

export function HeroSection({ content }: HeroSectionProps) {
  const scope = useRef<HTMLElement>(null)
  useHeroAnimation(scope)

  return (
    <section
      ref={scope}
      id="inicio"
      className="relative overflow-hidden bg-pine bg-hero bg-top bg-no-repeat pt-12 pb-84 sm:pb-100 lg:pt-16 lg:pb-128"
    >
      <Container className="flex flex-col items-center">
        <div className="w-full max-w-hero-text animate-in text-center duration-700 ease-out slide-in-from-bottom-5 fade-in">
          <p className="mb-4 font-medium text-sage sm:text-xl">{content.eyebrow}</p>
          <h1 className="mb-8 text-4xl/tight font-semibold text-balance text-paper sm:text-5xl/tight lg:text-7xl/tight">
            {content.title}
          </h1>
          <div className="flex flex-col-reverse items-center justify-center gap-6 sm:flex-row sm:gap-10">
            <ButtonLink href={content.waitlistHref} variant="onDark" className="h-auto px-0">
              <ClipboardListIcon className="size-6 text-sage-light" />
              {content.waitlistLabel}
            </ButtonLink>
            <ButtonLink href={content.ctaHref}>{content.ctaLabel}</ButtonLink>
          </div>
        </div>

        <div aria-hidden className="relative mt-4 hidden h-28 w-full max-w-hero-hands lg:block">
          <FloatingBadge icon={HeartIcon} className="bottom-0 left-0 -rotate-12" />
          <FloatingBadge icon={MessageCircleIcon} className="top-0 right-0 rotate-12" />
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
