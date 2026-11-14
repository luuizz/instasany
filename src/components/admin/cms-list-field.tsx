'use client'

import { useState } from 'react'
import { listCountName } from '@/lib/cms-form'
import { getPath } from '@/lib/object-path'
import type { CmsListField } from '@/types/cms'
import { CmsScalarInput } from './cms-scalar-input'

type CmsListFieldProps = { field: CmsListField; value: unknown }

type Item = { id: number; value: unknown }

let nextId = 0
const toItems = (value: unknown): Item[] =>
  (Array.isArray(value) ? value : []).map((item) => ({ id: nextId++, value: item }))

const action =
  'cursor-pointer rounded-full px-3 py-1 text-xs font-semibold hover:bg-ink/5 disabled:cursor-default disabled:opacity-30'

// Lista editável: os campos não são controlados; o id mantém cada item no lugar ao mover ou remover
export function CmsListFieldEditor({ field, value }: CmsListFieldProps) {
  const [items, setItems] = useState(() => toItems(value))

  const move = (index: number, delta: number) =>
    setItems((current) => {
      const next = [...current]
      const [item] = next.splice(index, 1)
      if (item) next.splice(index + delta, 0, item)
      return next
    })
  const remove = (index: number) => setItems((current) => current.filter((_, position) => position !== index))
  const add = () => setItems((current) => [...current, { id: nextId++, value: field.newItem }])

  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="mb-3 text-lg font-semibold">{field.label}</legend>
      <input type="hidden" name={listCountName(field.path)} value={items.length} />
      {items.map((item, index) => (
        <div key={item.id} className="flex flex-col gap-4 rounded-3xl border border-ink/10 p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-ink/60">
              {field.itemLabel} {index + 1}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                className={action}
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={`Subir ${field.itemLabel.toLowerCase()} ${index + 1}`}
              >
                ↑
              </button>
              <button
                type="button"
                className={action}
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                aria-label={`Descer ${field.itemLabel.toLowerCase()} ${index + 1}`}
              >
                ↓
              </button>
              <button
                type="button"
                className={`${action} text-red-700`}
                onClick={() => remove(index)}
                disabled={items.length <= field.min}
              >
                Remover
              </button>
            </div>
          </div>
          {field.fields.map((sub) => (
            <CmsScalarInput
              key={sub.path}
              field={sub}
              name={`${field.path}.${index}.${sub.path}`}
              value={getPath(item.value, sub.path)}
            />
          ))}
        </div>
      ))}
      {items.length < field.max && (
        <button
          type="button"
          onClick={add}
          className="cursor-pointer self-start rounded-full border border-dashed border-ink/30 px-5 py-3 text-sm font-semibold hover:border-sage"
        >
          + Adicionar {field.itemLabel.toLowerCase()}
        </button>
      )}
    </fieldset>
  )
}
