'use client'

import type { AuthFormState } from '@/app/(auth)/actions'
import { Input } from '@/components/ui/input'
import { FormMessage, LabeledField } from '@/components/ui/form-field'
import { SubmitButton } from '@/components/ui/submit-button'
import { useFormAction } from '@/hooks/use-form-action'

type AuthFormProps = {
  mode: 'sign-in' | 'sign-up'
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>
  back: string | null
}

export function AuthForm({ mode, action, back }: AuthFormProps) {
  const { state, onSubmit, pending } = useFormAction(action, null as AuthFormState)
  const signUp = mode === 'sign-up'

  if (state?.ok) return <FormMessage tone="success">{state.data.message}</FormMessage>

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {back && <input type="hidden" name="volta" value={back} />}
      <FormMessage>{state?.ok === false ? state.error : null}</FormMessage>
      {signUp && (
        <LabeledField label="Nome">
          <Input name="name" autoComplete="name" required maxLength={80} />
        </LabeledField>
      )}
      <LabeledField label="E-mail">
        <Input name="email" type="email" autoComplete="email" required />
      </LabeledField>
      <LabeledField label="Senha" hint={signUp ? 'Pelo menos 8 caracteres.' : undefined}>
        <Input
          name="password"
          type="password"
          autoComplete={signUp ? 'new-password' : 'current-password'}
          required
          minLength={signUp ? 8 : undefined}
        />
      </LabeledField>
      <SubmitButton pending={pending} pendingLabel={signUp ? 'Criando conta…' : 'Entrando…'}>
        {signUp ? 'Criar conta' : 'Entrar'}
      </SubmitButton>
    </form>
  )
}
