import type { SiteSectionKey } from '@/lib/validation/site-content'

export type CmsScalarField = {
  path: string
  label: string
  // lines: uma entrada por linha, vira lista de textos
  kind?: 'text' | 'textarea' | 'lines' | 'number' | 'checkbox'
  hint?: string
  optional?: boolean
}

// Lista de itens com os mesmos campos (benefícios, planos, perguntas...)
export type CmsListField = {
  path: string
  label: string
  kind: 'list'
  itemLabel: string
  fields: CmsScalarField[]
  min: number
  max: number
  newItem: Record<string, unknown>
}

export type CmsField = CmsScalarField | CmsListField

export type CmsSection = {
  key: SiteSectionKey
  title: string
  description: string
  fields: CmsField[]
}
