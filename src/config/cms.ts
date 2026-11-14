import type { SiteSectionKey } from '@/lib/validation/site-content'

export type CmsField = {
  path: string
  label: string
  kind?: 'text' | 'textarea'
  hint?: string
}

export type CmsSection = {
  key: SiteSectionKey
  title: string
  description: string
  fields: CmsField[]
}

// Seções editáveis no painel e os campos de cada uma (na ordem do formulário)
export const cmsSections: CmsSection[] = [
  {
    key: 'hero',
    title: 'Topo da página',
    description: 'Título principal, chamada e botões do início da home.',
    fields: [
      { path: 'eyebrow', label: 'Texto acima do título' },
      { path: 'title', label: 'Título', kind: 'textarea' },
      { path: 'ctaLabel', label: 'Texto do botão' },
      { path: 'ctaHref', label: 'Link do botão', hint: 'Âncora da página (#precos), caminho (/cursos) ou URL.' },
      { path: 'waitlistLabel', label: 'Texto da lista de espera' },
      { path: 'waitlistHref', label: 'Link da lista de espera' },
    ],
  },
  {
    key: 'showcase',
    title: 'Vitrine',
    description: 'Título "Faça você mesmo de casa" e a descrição das fotos.',
    fields: [
      { path: 'titleStart', label: 'Início do título' },
      { path: 'titleHighlight', label: 'Palavra em destaque' },
      { path: 'titleEnd', label: 'Fim do título' },
      ...[1, 2, 3, 4].map((index) => ({
        path: `cards.${index}.alt`,
        label: `Descrição da foto ${index}`,
        hint: 'Lida por leitores de tela.',
      })),
    ],
  },
]

export const findCmsSection = (key: string) => cmsSections.find((section) => section.key === key)
