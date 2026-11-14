'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import type { RefObject } from 'react'

gsap.registerPlugin(useGSAP)

// Entrada do texto e os celulares contornados se abrindo para os lados
export function useHeroAnimation(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const media = gsap.matchMedia()
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-reveal="hero-text"]',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: 'power4.out' },
        )
        gsap.fromTo('[data-reveal="phone-left"]', { rotate: 0 }, { rotate: -10, duration: 1 })
        gsap.fromTo('[data-reveal="phone-right"]', { rotate: 0 }, { rotate: 10, duration: 1 })
      })
      media.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('[data-reveal="hero-text"]', { opacity: 1 })
        gsap.set('[data-reveal="phone-left"]', { rotate: -10 })
        gsap.set('[data-reveal="phone-right"]', { rotate: 10 })
      })
      return () => media.revert()
    },
    { scope },
  )
}
