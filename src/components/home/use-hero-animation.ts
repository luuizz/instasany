'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import type { RefObject } from 'react'

gsap.registerPlugin(useGSAP)

// Celulares contornados se abrindo para os lados. A entrada do texto é CSS (hero-section),
// para o título aparecer na primeira pintura sem esperar o JavaScript.
export function useHeroAnimation(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const media = gsap.matchMedia()
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo('[data-reveal="phone-left"]', { rotate: 0 }, { rotate: -10, duration: 1 })
        gsap.fromTo('[data-reveal="phone-right"]', { rotate: 0 }, { rotate: 10, duration: 1 })
      })
      media.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('[data-reveal="phone-left"]', { rotate: -10 })
        gsap.set('[data-reveal="phone-right"]', { rotate: 10 })
      })
      return () => media.revert()
    },
    { scope },
  )
}
