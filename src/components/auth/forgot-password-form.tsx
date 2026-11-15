'use client'

import type { AuthFormState } from '@/app/(auth)/actions'
import { requestPasswordResetAction } from '@/app/(auth)/password-actions'
import { FormMessage, LabeledField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { SubmitButton } from '@/components/ui/submit-button'
import { useFormAction } from '@/hooks/use-form-action'

export function ForgotPasswordForm() {
  const { state, onSubmit, pending } = useFormAction(requestPasswordResetAction, null as AuthFormState)

  if (state?.ok) return <FormMessage tone="success">{state.data.message}</FormMessage>

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <FormMessage>{state?.ok === false ? state.error : null}</FormMessage>
      <LabeledField label="E-mail da conta">
        <Input name="email" type="email" autoComplete="email" required />
      </LabeledField>
      <SubmitButton pending={pending} pendingLabel="Enviando…">
        Enviar link
      </SubmitButton>
    </form>
  )
}
