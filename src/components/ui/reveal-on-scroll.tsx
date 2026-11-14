'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type RevealOnScrollProps = React.ComponentProps<'div'>

// Elementos com data-reveal-item sobem e aparecem em sequência quando entram na tela
export function RevealOnScroll(props: RevealOnScrollProps) {
  const scope = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const media = gsap.matchMedia()
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const items = gsap.utils.toArray<HTMLElement>('[data-reveal-item]')
        gsap.set(items, { opacity: 0, y: 40 })
        ScrollTrigger.batch(items, {
          start: 'top 85%',
          once: true,
          onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }),
        })
      })
      return () => media.revert()
    },
    { scope },
  )

  return <div ref={scope} {...props} />
}
