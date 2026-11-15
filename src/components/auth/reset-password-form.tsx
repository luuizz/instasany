'use client'

import type { AuthFormState } from '@/app/(auth)/actions'
import { resetPasswordAction } from '@/app/(auth)/password-actions'
import { FormMessage } from '@/components/ui/form-field'
import { SubmitButton } from '@/components/ui/submit-button'
import { useFormAction } from '@/hooks/use-form-action'
import { NewPasswordFields } from './new-password-fields'

export function ResetPasswordForm({ token }: { token: string }) {
  const { state, onSubmit, pending } = useFormAction(resetPasswordAction, null as AuthFormState)

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <input type="hidden" name="token" value={token} />
      <FormMessage>{state?.ok === false ? state.error : null}</FormMessage>
      <NewPasswordFields />
      <SubmitButton pending={pending} pendingLabel="Salvando…">
        Salvar senha nova
      </SubmitButton>
    </form>
  )
}
