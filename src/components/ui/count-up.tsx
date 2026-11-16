'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Separa "+12 mil" em prefixo, número e sufixo; anos (2019) não contam, ficam como estão
function parse(value: string) {
  const match = value.match(/^(\D*?)(\d+(?:,\d+)?)(.*)$/)
  if (!match) return null
  const [, prefix = '', digits = '', suffix = ''] = match
  if (/^(19|20)\d{2}$/.test(digits)) return null
  const decimals = digits.split(',')[1]?.length ?? 0
  return { prefix, suffix, target: Number(digits.replace(',', '.')), decimals }
}

// Número que conta do zero até o valor quando entra na tela. O texto final já vem do servidor,
// então sem JavaScript ou com movimento reduzido ele aparece pronto.
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const parsed = parse(value)
      const element = ref.current
      if (!parsed || !element) return
      const format = (n: number) =>
        `${parsed.prefix}${n.toLocaleString('pt-BR', { minimumFractionDigits: parsed.decimals, maximumFractionDigits: parsed.decimals })}${parsed.suffix}`
      const media = gsap.matchMedia()
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const counter = { n: 0 }
        element.textContent = format(0)
        gsap.to(counter, {
          n: parsed.target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            element.textContent = format(counter.n)
          },
          scrollTrigger: { trigger: element, start: 'top 90%', once: true },
        })
        return () => {
          element.textContent = value
        }
      })
      return () => media.revert()
    },
    { dependencies: [value] },
  )

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  )
}
