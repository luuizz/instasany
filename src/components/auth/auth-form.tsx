'use client'

import { CheckIcon, MailCheckIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import type { AuthFormState } from '@/app/(auth)/actions'
import { FormMessage, LabeledField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { SubmitButton } from '@/components/ui/submit-button'
import { useFormAction } from '@/hooks/use-form-action'
import { PASSWORD_MIN } from '@/lib/validation/auth'
import { cn } from '@/lib/utils'
import { AuthNotice } from './auth-notice'

type AuthFormProps = {
  mode: 'sign-in' | 'sign-up'
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>
  back: string | null
}

export function AuthForm({ mode, action, back }: AuthFormProps) {
  const { state, onSubmit, pending } = useFormAction(action, null as AuthFormState)
  const [passwordLength, setPasswordLength] = useState(0)
  const signUp = mode === 'sign-up'
  const longEnough = passwordLength >= PASSWORD_MIN

  if (state?.ok) {
    return (
      <AuthNotice icon={MailCheckIcon} title="Confira seu e-mail">
        {state.data.message}
      </AuthNotice>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {back && <input type="hidden" name="volta" value={back} />}
      <FormMessage>{state?.ok === false ? state.error : null}</FormMessage>
      {signUp && (
        <LabeledField label="Nome">
          <Input name="name" autoComplete="name" placeholder="Como quer ser chamado" required maxLength={80} />
        </LabeledField>
      )}
      <LabeledField label="E-mail">
        <Input name="email" type="email" autoComplete="email" placeholder="voce@email.com" required />
      </LabeledField>
      <LabeledField
        label="Senha"
        aside={
          !signUp && (
            <Link
              href="/esqueci-senha"
              className="text-sm font-medium text-sage underline-offset-4 hover:text-pine hover:underline"
            >
              Esqueci a senha
            </Link>
          )
        }
      >
        <PasswordInput
          name="password"
          autoComplete={signUp ? 'new-password' : 'current-password'}
          required
          minLength={signUp ? PASSWORD_MIN : undefined}
          onChange={signUp ? (event) => setPasswordLength(event.target.value.length) : undefined}
        />
      </LabeledField>
      {signUp && (
        <p className={cn('-mt-2 flex items-center gap-2 text-xs transition', longEnough ? 'text-sage' : 'text-ink/65')}>
          <span
            className={cn(
              'flex size-4 items-center justify-center rounded-full transition',
              longEnough ? 'bg-sage text-paper' : 'bg-secondary',
            )}
          >
            {longEnough && <CheckIcon className="size-3" strokeWidth={3} />}
          </span>
          Pelo menos {PASSWORD_MIN} caracteres
        </p>
      )}
      <SubmitButton pending={pending} pendingLabel={signUp ? 'Criando conta…' : 'Entrando…'} className="mt-1">
        {signUp ? 'Criar conta grátis' : 'Entrar'}
      </SubmitButton>
      {signUp && (
        <p className="text-center text-xs text-ink/65">
          Ao criar a conta você concorda com a nossa{' '}
          <Link href="/privacidade" className="underline underline-offset-4 hover:text-pine">
            política de privacidade
          </Link>
          .
        </p>
      )}
    </form>
  )
}
