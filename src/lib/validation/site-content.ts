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

const list = <T extends z.ZodType>(item: T, label: string, min: number, max: number) =>
  z.array(item).min(min, `Inclua pelo menos ${min} ${label}.`).max(max, `Use no máximo ${max} ${label}.`)

const heading = {
  eyebrow: text('o texto acima do título', 40),
  title: text('o título', 90),
}

export const benefitsSchema = z.object({
  ...heading,
  items: list(
    z.object({ title: text('o título do benefício', 60), text: text('a descrição do benefício', 180) }),
    'benefícios',
    3,
    9,
  ),
})

export const audienceSchema = z.object({
  ...heading,
  description: text('a descrição', 280),
  items: list(text('o item da lista', 120), 'itens', 2, 8),
  ctaLabel: text('o texto do botão', 30),
  ctaHref: link('Link do botão'),
})

const price = (label: string) =>
  z
    .number({ error: `Informe ${label} em reais.` })
    .nonnegative(`${label} não pode ser negativo.`)
    .max(100_000)

export const planSchema = z.object({
  name: text('o nome do plano', 40),
  description: text('a descrição do plano', 120),
  price: price('o preço'),
  compareAt: price('o preço antigo').nullable(),
  period: text('a condição de pagamento', 40),
  features: list(text('o item do plano', 90), 'itens no plano', 1, 10),
  ctaLabel: text('o texto do botão do plano', 30),
  highlight: z.boolean(),
})

export const pricingSchema = z.object({
  ...heading,
  note: text('a observação', 160),
  ctaHref: link('Link dos botões'),
  plans: list(planSchema, 'planos', 1, 4).refine(
    (plans) => plans.filter((plan) => plan.highlight).length <= 1,
    'Destaque no máximo um plano.',
  ),
})

export const aboutSchema = z.object({
  ...heading,
  paragraphs: list(text('o parágrafo', 600), 'parágrafos', 1, 5),
  stats: list(z.object({ value: text('o número', 12), label: text('a legenda do número', 40) }), 'números', 2, 4),
})

export const faqSchema = z.object({
  ...heading,
  items: list(z.object({ question: text('a pergunta', 140), answer: text('a resposta', 600) }), 'perguntas', 1, 12),
})

export const footerSchema = z.object({
  tagline: text('a frase do rodapé', 160),
  email: z.string().trim().email('Informe um e-mail de contato válido.'),
  socials: list(
    z.object({
      label: text('o nome da rede', 30),
      href: z.string().trim().url('Use o endereço completo da rede (https://...).'),
    }),
    'redes',
    0,
    6,
  ),
})

export const siteSectionSchemas = {
  hero: heroSchema,
  showcase: showcaseSchema,
  benefits: benefitsSchema,
  audience: audienceSchema,
  pricing: pricingSchema,
  about: aboutSchema,
  faq: faqSchema,
  footer: footerSchema,
} as const

export type SiteSectionKey = keyof typeof siteSectionSchemas
export const siteSectionKeys = Object.keys(siteSectionSchemas) as SiteSectionKey[]
export const isSiteSectionKey = (value: string): value is SiteSectionKey => value in siteSectionSchemas
