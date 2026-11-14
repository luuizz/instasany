import { z } from 'zod'

const text = (label: string, max = 120) =>
  z
    .string()
    .trim()
    .min(1, `Preencha ${label}.`)
    .max(max, `${label[0]?.toUpperCase()}${label.slice(1)} pode ter até ${max} caracteres.`)

const link = (label: string) =>
  z
    .string()
    .trim()
    .regex(
      /^(#[\w-]+|\/[^\s]*|https?:\/\/\S+)$/,
      `${label}: use uma âncora (#precos), um caminho (/cursos) ou uma URL.`,
    )

export const heroSchema = z.object({
  eyebrow: text('o texto acima do título', 80),
  title: text('o título', 90),
  waitlistLabel: text('o texto da lista de espera', 40),
  waitlistHref: link('Link da lista de espera'),
  ctaLabel: text('o texto do botão', 30),
  ctaHref: link('Link do botão'),
})

export const showcaseCardSchema = z.object({
  src: z.string().regex(/^\/images\/[\w-]+\.(png|jpe?g|webp|svg)$/, 'Imagem inválida.'),
  alt: z.string().trim().max(140, 'A descrição da imagem pode ter até 140 caracteres.'),
  decorative: z.boolean().optional(),
})

export const showcaseSchema = z.object({
  titleStart: text('o início do título', 40),
  titleHighlight: text('a palavra em destaque', 30),
  titleEnd: text('o fim do título', 40),
  cards: z.array(showcaseCardSchema).length(6, 'A vitrine tem 6 cards.'),
})

export const siteSectionSchemas = {
  hero: heroSchema,
  showcase: showcaseSchema,
} as const

export type SiteSectionKey = keyof typeof siteSectionSchemas
export const siteSectionKeys = Object.keys(siteSectionSchemas) as SiteSectionKey[]
export const isSiteSectionKey = (value: string): value is SiteSectionKey => value in siteSectionSchemas
