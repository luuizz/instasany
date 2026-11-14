import type { CmsField, CmsScalarField } from '@/types/cms'
import { setPath } from './object-path'

export const listCountName = (path: string) => `${path}.__count`

function readScalar(field: CmsScalarField, formData: FormData, name: string): unknown {
  if (field.kind === 'checkbox') return formData.has(name)
  const raw = String(formData.get(name) ?? '')
  if (field.kind === 'lines') {
    return raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  }
  if (field.kind === 'number') return raw.trim() === '' ? null : Number(raw.replace(',', '.'))
  return raw
}

// Monta o conteúdo da seção a partir do formulário do painel, partindo do conteúdo atual:
// campos simples trocam só o próprio valor; listas são refeitas na ordem do formulário
export function readCmsForm(fields: CmsField[], formData: FormData, current: unknown): unknown {
  let data = current
  for (const field of fields) {
    if (field.kind !== 'list') {
      data = setPath(data, field.path, readScalar(field, formData, field.path))
      continue
    }
    const count = Math.min(Number(formData.get(listCountName(field.path)) ?? 0), field.max)
    const items = Array.from({ length: count }, (_, index) =>
      field.fields.reduce<Record<string, unknown>>(
        (item, sub) => setPath(item, sub.path, readScalar(sub, formData, `${field.path}.${index}.${sub.path}`)),
        { ...field.newItem },
      ),
    )
    data = setPath(data, field.path, items)
  }
  return data
}
