'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { RefObject } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Cada prévia do bento roda em loop enquanto está na tela e pausa fora dela.
// Com movimento reduzido nada é animado: o HTML já mostra o estado final.
export function useProductAnimation(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const media = gsap.matchMedia()
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const loop = (trigger: string, repeatDelay: number) =>
          gsap.timeline({
            repeat: -1,
            repeatDelay,
            scrollTrigger: { trigger, start: 'top 85%', end: 'bottom 10%', toggleActions: 'play pause resume pause' },
          })

        loop('[data-tile="dashboard"]', 2.5)
          .fromTo('[data-anim="tile"]', { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.4 })
          .fromTo('[data-anim="progress"]', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power2.out' }, '<')
          .fromTo(
            '[data-anim="lesson"]',
            { opacity: 0, x: -12 },
            { opacity: 1, x: 0, stagger: 0.12, duration: 0.4 },
            '<0.2',
          )
          .fromTo('[data-anim="lesson-check"]', { scale: 0 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' })
          .fromTo(
            '[data-anim="bar"]',
            { scaleY: 0 },
            { scaleY: 1, stagger: 0.08, duration: 0.6, ease: 'back.out(1.6)' },
            '<0.2',
          )

        gsap.fromTo(
          '[data-anim="ping"]',
          { scale: 1, opacity: 0.9 },
          { scale: 1.35, opacity: 0, duration: 1.4, repeat: -1, ease: 'power1.out' },
        )

        loop('[data-tile="quiz"]', 2)
          .fromTo(
            '[data-anim="option"], [data-anim="answer"]',
            { opacity: 0, x: -10 },
            { opacity: 1, x: 0, stagger: 0.12, duration: 0.35 },
          )
          .fromTo(
            '[data-anim="answer-fill"]',
            { scaleX: 0 },
            { scaleX: 1, duration: 0.45, ease: 'power2.out' },
            '+=0.4',
          )
          .fromTo('[data-anim="answer-check"]', { scale: 0 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' }, '<0.2')
          .fromTo('[data-anim="score"]', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, '+=0.2')

        loop('[data-tile="certificate"]', 2.2)
          .fromTo(
            '[data-anim="certificate"]',
            { opacity: 0, y: 24, rotate: -6 },
            { opacity: 1, y: 0, rotate: -2, duration: 0.8, ease: 'power3.out' },
          )
          .fromTo(
            '[data-anim="stamp"]',
            { scale: 0.4, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2.5)' },
          )
          .fromTo('[data-anim="linkedin"]', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35 })
          .fromTo('[data-anim="shine"]', { xPercent: 0 }, { xPercent: 600, duration: 0.9, ease: 'power2.inOut' })
      })
      return () => media.revert()
    },
    { scope },
  )
}
