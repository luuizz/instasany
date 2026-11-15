'use client'

import type { FormState } from '@/app/(admin)/admin/cursos/actions'
import { Input } from '@/components/ui/input'
import { FormMessage } from '@/components/ui/form-field'
import { SubmitButton } from '@/components/ui/submit-button'
import { useFormAction } from '@/hooks/use-form-action'

type InlineTitleFormProps = {
  action: (state: FormState, formData: FormData) => Promise<FormState>
  label: string
  submitLabel: string
  defaultValue?: string
  resetOnSuccess?: boolean
}

// Um campo de texto e um botão: criar ou renomear módulo
export function InlineTitleForm({ action, label, submitLabel, defaultValue, resetOnSuccess }: InlineTitleFormProps) {
  const { state, onSubmit, pending } = useFormAction(action, null as FormState)

  return (
    <form
      onSubmit={(event) => {
        const form = event.currentTarget
        onSubmit(event)
        if (resetOnSuccess) setTimeout(() => form.reset(), 0)
      }}
      className="flex flex-col gap-2"
    >
      <div className="flex gap-2">
        <Input
          name="title"
          aria-label={label}
          placeholder={label}
          defaultValue={defaultValue}
          required
          maxLength={80}
        />
        <SubmitButton size="default" pending={pending} className="shrink-0">
          {submitLabel}
        </SubmitButton>
      </div>
      {state?.ok === false && <FormMessage>{state.error}</FormMessage>}
    </form>
  )
}
