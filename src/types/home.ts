import type { z } from 'zod'
import type { heroSchema, showcaseCardSchema, showcaseSchema } from '@/lib/validation/site-content'

export type HeroContent = z.output<typeof heroSchema>
export type ShowcaseCard = z.output<typeof showcaseCardSchema>
export type ShowcaseContent = z.output<typeof showcaseSchema>

export type HomeContent = {
  hero: HeroContent
  showcase: ShowcaseContent
}
