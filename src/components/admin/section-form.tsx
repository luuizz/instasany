'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import type { SectionFormState } from '@/app/(admin)/admin/conteudo/actions'
import { RotateCcwIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { FormMessage } from '@/components/ui/form-field'
import { SubmitButton } from '@/components/ui/submit-button'
import { useFormAction } from '@/hooks/use-form-action'
import type { CmsField } from '@/config/cms'
import { getPath } from '@/lib/object-path'
import type { ActionResult } from '@/lib/result'
import { CmsListFieldEditor } from './cms-list-field'
import { CmsScalarInput } from './cms-scalar-input'

type SectionFormProps = {
  fields: CmsField[]
  data: unknown
  save: (state: SectionFormState, formData: FormData) => Promise<SectionFormState>
  reset: () => Promise<ActionResult<unknown>>
}

export function SectionForm({ fields, data, save, reset }: SectionFormProps) {
  const { state, onSubmit, pending } = useFormAction(
    save,
    null as SectionFormState,
    'Salvo! O site já mostra a nova versão.',
  )
  const [resetting, startReset] = useTransition()
  // Depois de restaurar, os campos (não controlados) remontam com o conteúdo padrão
  const [current, setCurrent] = useState({ data, version: 0 })
  const top = useRef<HTMLDivElement>(null)

  // O erro fica no topo de um formulário longo: leva a pessoa até ele
  useEffect(() => {
    if (state?.ok === false) top.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [state])

  const onReset = () =>
    startReset(async () => {
      const result = await reset()
      if (!result.ok) return
      setCurrent((previous) => ({ data: result.data, version: previous.version + 1 }))
      toast.success('Seção de volta ao conteúdo padrão.')
    })

  return (
    <form key={current.version} onSubmit={onSubmit} className="flex flex-col gap-5">
      <div ref={top} className="flex flex-col gap-3 empty:hidden">
        <FormMessage>{state?.ok === false ? state.error : null}</FormMessage>
      </div>
      {fields.map((field) =>
        field.kind === 'list' ? (
          <CmsListFieldEditor key={field.path} field={field} value={getPath(current.data, field.path)} />
        ) : (
          <CmsScalarInput key={field.path} field={field} name={field.path} value={getPath(current.data, field.path)} />
        ),
      )}
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <SubmitButton size="default" pending={pending} pendingLabel="Salvando…">
          Salvar alterações
        </SubmitButton>
        <ConfirmDialog
          title="Voltar esta seção ao conteúdo padrão?"
          description="O que foi salvo no painel para esta seção será descartado."
          confirmLabel="Restaurar"
          onConfirm={onReset}
        >
          <Button type="button" variant="ghost" disabled={resetting}>
            <RotateCcwIcon />
            {resetting ? 'Restaurando…' : 'Restaurar padrão'}
          </Button>
        </ConfirmDialog>
      </div>
    </form>
  )
}
