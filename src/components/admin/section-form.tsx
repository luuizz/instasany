'use client'

import { useState, useTransition } from 'react'
import type { SectionFormState } from '@/app/(admin)/admin/conteudo/actions'
import { Field, FormMessage, Input, Textarea } from '@/components/ui/field'
import { SubmitButton } from '@/components/ui/submit-button'
import { useFormAction } from '@/hooks/use-form-action'
import type { CmsField } from '@/config/cms'
import { getPath } from '@/lib/object-path'
import type { ActionResult } from '@/lib/result'

type SectionFormProps = {
  fields: CmsField[]
  values: Record<string, string>
  save: (state: SectionFormState, formData: FormData) => Promise<SectionFormState>
  reset: () => Promise<ActionResult<unknown>>
}

export function SectionForm({ fields, values, save, reset }: SectionFormProps) {
  const { state, onSubmit, pending } = useFormAction(save, null as SectionFormState)
  const [resetting, startReset] = useTransition()
  // Depois de restaurar, os campos (não controlados) remontam com o conteúdo padrão
  const [current, setCurrent] = useState({ values, version: 0 })

  const onReset = () => {
    if (!window.confirm('Voltar esta seção ao conteúdo padrão?')) return
    startReset(async () => {
      const result = await reset()
      if (!result.ok) return
      const defaults = Object.fromEntries(
        fields.map((field) => [field.path, String(getPath(result.data, field.path) ?? '')]),
      )
      setCurrent((previous) => ({ values: defaults, version: previous.version + 1 }))
    })
  }

  return (
    <form key={current.version} onSubmit={onSubmit} className="flex flex-col gap-5">
      <FormMessage>{state?.ok === false ? state.error : null}</FormMessage>
      <FormMessage tone="success">{state?.ok ? 'Salvo! O site já mostra a nova versão.' : null}</FormMessage>
      {fields.map((field) => (
        <Field key={field.path} label={field.label} hint={field.hint}>
          {field.kind === 'textarea' ? (
            <Textarea name={field.path} defaultValue={current.values[field.path]} required />
          ) : (
            <Input
              name={field.path}
              defaultValue={current.values[field.path]}
              required={!field.path.endsWith('.alt')}
            />
          )}
        </Field>
      ))}
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <SubmitButton pending={pending} pendingLabel="Salvando…">
          Salvar alterações
        </SubmitButton>
        <button
          type="button"
          onClick={onReset}
          disabled={resetting}
          className="cursor-pointer text-sm font-semibold text-ink/60 underline-offset-4 hover:underline disabled:opacity-50"
        >
          {resetting ? 'Restaurando…' : 'Restaurar padrão'}
        </button>
      </div>
    </form>
  )
}
