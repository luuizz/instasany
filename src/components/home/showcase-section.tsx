'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import type { ShowcaseContent } from '@/types/home'
import { useShowcaseAnimation } from './use-showcase-animation'

type ShowcaseSectionProps = { content: ShowcaseContent }

// Posição de cada card na composição do desktop (na ordem do conteúdo)
const desktopPositions = [
  'lg:top-8 lg:left-44',
  'lg:bottom-32 lg:left-0',
  'lg:bottom-0 lg:left-80',
  'lg:top-0 lg:right-32',
  'lg:right-0 lg:bottom-28',
  'lg:right-80 lg:bottom-0',
]

export function ShowcaseSection({ content }: ShowcaseSectionProps) {
  const scope = useRef<HTMLElement>(null)
  useShowcaseAnimation(scope)
  const half = Math.ceil(content.cards.length / 2)

  return (
    <section ref={scope} className="w-full px-4 pb-20 sm:px-6">
      <Image
        data-reveal="phone"
        src="/images/phone.png"
        alt="Story da Instasany aberto no celular"
        width={329}
        height={663}
        priority
        className="relative z-10 mx-auto -mt-80 mb-12 w-52 opacity-0 sm:-mt-96 sm:w-64 lg:sticky lg:top-56 lg:-mt-128 lg:mb-16 lg:w-auto"
      />
      <h2
        data-reveal="title"
        className="mb-12 text-center text-4xl font-semibold text-ink opacity-0 sm:text-5xl lg:mb-56 lg:text-7xl"
      >
        {content.titleStart} <span className="text-sage-light">{content.titleHighlight}</span> {content.titleEnd}
      </h2>

      <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 sm:gap-5 lg:relative lg:block lg:h-140.5 lg:max-w-cards">
        {content.cards.map((card, index) => (
          <Image
            key={card.src}
            data-reveal={index < half ? 'card-left' : 'card-right'}
            src={card.src}
            alt={card.alt}
            width={250}
            height={175}
            className={cn(
              'h-auto w-full rounded-3xl opacity-0 lg:absolute lg:w-auto lg:rounded-none',
              desktopPositions[index],
              card.decorative && 'hidden lg:block',
            )}
          />
        ))}
      </div>
    </section>
  )
}
