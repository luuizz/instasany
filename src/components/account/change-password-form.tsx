'use client'

import { useRef } from 'react'
import { changePasswordAction } from '@/app/(aluno)/aluno/perfil/actions'
import { NewPasswordFields } from '@/components/auth/new-password-fields'
import { FormMessage, LabeledField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { SubmitButton } from '@/components/ui/submit-button'
import { useFormAction } from '@/hooks/use-form-action'
import type { ActionResult } from '@/lib/result'

export function ChangePasswordForm() {
  const form = useRef<HTMLFormElement>(null)
  const { state, onSubmit, pending } = useFormAction<ActionResult | null>(
    async (previous, formData) => {
      const result = await changePasswordAction(previous, formData)
      // Senha nunca fica nos campos depois de trocada
      if (result.ok) form.current?.reset()
      return result
    },
    null,
    'Senha trocada. As outras sessões foram encerradas.',
  )

  return (
    <form ref={form} onSubmit={onSubmit} className="flex flex-col gap-5">
      <FormMessage>{state?.ok === false ? state.error : null}</FormMessage>
      <LabeledField label="Senha atual">
        <Input name="currentPassword" type="password" autoComplete="current-password" required />
      </LabeledField>
      <NewPasswordFields />
      <SubmitButton size="default" pending={pending} pendingLabel="Trocando…" className="self-start">
        Trocar senha
      </SubmitButton>
    </form>
  )
}
