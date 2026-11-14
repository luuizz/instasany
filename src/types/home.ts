import type { z } from 'zod'
import type { showcaseCardSchema, siteSectionSchemas } from '@/lib/validation/site-content'

type Schemas = typeof siteSectionSchemas

// Conteúdo da home: uma chave por seção, no formato do schema de cada uma
export type HomeContent = { [K in keyof Schemas]: z.output<Schemas[K]> }

export type HeroContent = HomeContent['hero']
export type ShowcaseCard = z.output<typeof showcaseCardSchema>
export type ShowcaseContent = HomeContent['showcase']
export type BenefitsContent = HomeContent['benefits']
export type AudienceContent = HomeContent['audience']
export type PricingContent = HomeContent['pricing']
export type Plan = PricingContent['plans'][number]
export type AboutContent = HomeContent['about']
export type FaqContent = HomeContent['faq']
export type FooterContent = HomeContent['footer']
