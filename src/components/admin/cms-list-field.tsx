'use client'

import { ArrowDownIcon, ArrowUpIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FieldLegend, FieldSet } from '@/components/ui/field'
import { listCountName } from '@/lib/cms-form'
import { getPath } from '@/lib/object-path'
import type { CmsListField } from '@/types/cms'
import { CmsScalarInput } from './cms-scalar-input'

type CmsListFieldProps = { field: CmsListField; value: unknown }

type Item = { id: number; value: unknown }

let nextId = 0
const toItems = (value: unknown): Item[] =>
  (Array.isArray(value) ? value : []).map((item) => ({ id: nextId++, value: item }))

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
    <FieldSet className="gap-4">
      <FieldLegend className="mb-1 text-lg font-semibold">{field.label}</FieldLegend>
      <input type="hidden" name={listCountName(field.path)} value={items.length} />
      {items.map((item, index) => (
        <Card
          key={item.id}
          className="animate-in gap-4 rounded-3xl p-5 shadow-none duration-300 fade-in slide-in-from-bottom-1"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <span className="flex size-6 items-center justify-center rounded-full bg-secondary text-xs text-pine">
                {index + 1}
              </span>
              {field.itemLabel} {index + 1}
            </span>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={`Subir ${field.itemLabel.toLowerCase()} ${index + 1}`}
              >
                <ArrowUpIcon />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                aria-label={`Descer ${field.itemLabel.toLowerCase()} ${index + 1}`}
              >
                <ArrowDownIcon />
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="icon-sm"
                onClick={() => remove(index)}
                disabled={items.length <= field.min}
                aria-label={`Remover ${field.itemLabel.toLowerCase()} ${index + 1}`}
              >
                <Trash2Icon />
              </Button>
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
        </Card>
      ))}
      {items.length < field.max && (
        <Button type="button" variant="outline" onClick={add} className="self-start border-dashed">
          <PlusIcon />
          Adicionar {field.itemLabel.toLowerCase()}
        </Button>
      )}
    </FieldSet>
  )
}
