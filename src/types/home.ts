export type HeroContent = {
  eyebrow: string
  title: string
  waitlistLabel: string
  waitlistHref: string
  ctaLabel: string
  ctaHref: string
}

export type ShowcaseCard = {
  src: string
  alt: string
  // Bloco só de composição (sem foto): fica fora da grade no celular
  decorative?: boolean
}

export type ShowcaseContent = {
  titleStart: string
  titleHighlight: string
  titleEnd: string
  cards: ShowcaseCard[]
}

export type HomeContent = {
  hero: HeroContent
  showcase: ShowcaseContent
}
