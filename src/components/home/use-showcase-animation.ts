'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { RefObject } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Celular aparece com zoom; título e cards entram quando a seção chega ao centro da tela
export function useShowcaseAnimation(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const section = scope.current
      if (!section) return
      const media = gsap.matchMedia()

      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-reveal="phone"]',
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 1, ease: 'power4.out' },
        )
        gsap.fromTo(
          '[data-reveal="title"]',
          { opacity: 0, y: 100 },
          { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: section, start: '30% center' } },
        )
        for (const [side, offset] of [
          ['left', 50],
          ['right', -50],
        ] as const) {
          gsap.fromTo(
            `[data-reveal="card-${side}"]`,
            { opacity: 0, x: offset },
            {
              opacity: 1,
              x: 0,
              duration: 0.5,
              stagger: 0.1,
              scrollTrigger: { trigger: section, start: 'center center' },
            },
          )
        }
      })
      media.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('[data-reveal]', { opacity: 1 })
      })
      return () => media.revert()
    },
    { scope },
  )
}
