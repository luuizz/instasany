'use client'

import { MailCheckIcon } from 'lucide-react'
import type { AuthFormState } from '@/app/(auth)/actions'
import { requestPasswordResetAction } from '@/app/(auth)/password-actions'
import { FormMessage, LabeledField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { SubmitButton } from '@/components/ui/submit-button'
import { useFormAction } from '@/hooks/use-form-action'
import { AuthNotice } from './auth-notice'

export function ForgotPasswordForm() {
  const { state, onSubmit, pending } = useFormAction(requestPasswordResetAction, null as AuthFormState)

  if (state?.ok) {
    return (
      <AuthNotice icon={MailCheckIcon} title="Link enviado">
        {state.data.message}
      </AuthNotice>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <FormMessage>{state?.ok === false ? state.error : null}</FormMessage>
      <LabeledField label="E-mail da conta">
        <Input name="email" type="email" autoComplete="email" placeholder="voce@email.com" required />
      </LabeledField>
      <SubmitButton pending={pending} pendingLabel="Enviando…">
        Enviar link
      </SubmitButton>
    </form>
  )
}
