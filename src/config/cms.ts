import type { CmsField, CmsListField, CmsSection } from '@/types/cms'

export type { CmsField, CmsSection } from '@/types/cms'

const heading: CmsField[] = [
  { path: 'eyebrow', label: 'Texto acima do título' },
  { path: 'title', label: 'Título', kind: 'textarea' },
]

const linkHint = 'Âncora da página (#precos), caminho (/cadastro) ou URL.'

const list = (field: Omit<CmsListField, 'kind'>): CmsListField => ({ kind: 'list', ...field })

// Seções editáveis no painel, na ordem em que aparecem no site
export const cmsSections: CmsSection[] = [
  {
    key: 'hero',
    title: 'Topo da página',
    description: 'Título principal, chamada e botões do início da home.',
    fields: [
      { path: 'eyebrow', label: 'Texto acima do título' },
      { path: 'title', label: 'Título', kind: 'textarea' },
      { path: 'ctaLabel', label: 'Texto do botão' },
      { path: 'ctaHref', label: 'Link do botão', hint: linkHint },
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
        optional: true,
      })),
    ],
  },
  {
    key: 'benefits',
    title: 'Benefícios',
    description: 'Os motivos para fazer o curso, em cards numerados.',
    fields: [
      ...heading,
      list({
        path: 'items',
        label: 'Benefícios',
        itemLabel: 'Benefício',
        min: 3,
        max: 9,
        newItem: { title: '', text: '' },
        fields: [
          { path: 'title', label: 'Título' },
          { path: 'text', label: 'Descrição', kind: 'textarea' },
        ],
      }),
    ],
  },
  {
    key: 'audience',
    title: 'Para quem é o curso',
    description: 'Descrição do público e a lista de perfis que o curso atende.',
    fields: [
      ...heading,
      { path: 'description', label: 'Descrição', kind: 'textarea' },
      { path: 'items', label: 'Para quem é', kind: 'lines', hint: 'Um item por linha.' },
      { path: 'ctaLabel', label: 'Texto do botão' },
      { path: 'ctaHref', label: 'Link do botão', hint: linkHint },
    ],
  },
  {
    key: 'pricing',
    title: 'Preços',
    description: 'Planos, preços promocionais e o que cada um inclui.',
    fields: [
      ...heading,
      { path: 'note', label: 'Observação abaixo dos planos', kind: 'textarea' },
      { path: 'ctaHref', label: 'Link dos botões dos planos', hint: linkHint },
      list({
        path: 'plans',
        label: 'Planos',
        itemLabel: 'Plano',
        min: 1,
        max: 4,
        newItem: { highlight: false, compareAt: null },
        fields: [
          { path: 'name', label: 'Nome' },
          { path: 'description', label: 'Descrição' },
          { path: 'price', label: 'Preço (R$)', kind: 'number' },
          {
            path: 'compareAt',
            label: 'Preço antigo (R$)',
            kind: 'number',
            optional: true,
            hint: 'Deixe vazio para não riscar.',
          },
          { path: 'period', label: 'Condição de pagamento', hint: 'Ex.: pagamento único, ou 12x de R$ 33,08.' },
          { path: 'features', label: 'O que inclui', kind: 'lines', hint: 'Um item por linha.' },
          { path: 'ctaLabel', label: 'Texto do botão' },
          { path: 'highlight', label: 'Plano em destaque', kind: 'checkbox' },
        ],
      }),
    ],
  },
  {
    key: 'about',
    title: 'Sobre nós',
    description: 'A história da Instasany e os números em destaque.',
    fields: [
      ...heading,
      { path: 'paragraphs', label: 'Texto', kind: 'lines', hint: 'Cada linha vira um parágrafo.' },
      list({
        path: 'stats',
        label: 'Números',
        itemLabel: 'Número',
        min: 2,
        max: 4,
        newItem: { value: '', label: '' },
        fields: [
          { path: 'value', label: 'Número', hint: 'Ex.: +12 mil' },
          { path: 'label', label: 'Legenda' },
        ],
      }),
    ],
  },
  {
    key: 'faq',
    title: 'Perguntas frequentes',
    description: 'Dúvidas comuns sobre o curso, abertas uma de cada vez.',
    fields: [
      ...heading,
      list({
        path: 'items',
        label: 'Perguntas',
        itemLabel: 'Pergunta',
        min: 1,
        max: 12,
        newItem: { question: '', answer: '' },
        fields: [
          { path: 'question', label: 'Pergunta' },
          { path: 'answer', label: 'Resposta', kind: 'textarea' },
        ],
      }),
    ],
  },
  {
    key: 'footer',
    title: 'Rodapé',
    description: 'Frase de apresentação, e-mail de contato e redes sociais.',
    fields: [
      { path: 'tagline', label: 'Frase', kind: 'textarea' },
      { path: 'email', label: 'E-mail de contato' },
      list({
        path: 'socials',
        label: 'Redes sociais',
        itemLabel: 'Rede',
        min: 0,
        max: 6,
        newItem: { label: '', href: '' },
        fields: [
          { path: 'label', label: 'Nome' },
          { path: 'href', label: 'Endereço', hint: 'https://...' },
        ],
      }),
    ],
  },
]

export const findCmsSection = (key: string) => cmsSections.find((section) => section.key === key)
