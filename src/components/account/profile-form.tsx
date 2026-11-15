'use client'

import { updateProfileAction } from '@/app/(aluno)/aluno/perfil/actions'
import { FormMessage, LabeledField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { SubmitButton } from '@/components/ui/submit-button'
import { useFormAction } from '@/hooks/use-form-action'
import type { ActionResult } from '@/lib/result'

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const { state, onSubmit, pending } = useFormAction<ActionResult | null>(updateProfileAction, null, 'Nome salvo.')

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <FormMessage>{state?.ok === false ? state.error : null}</FormMessage>
      <LabeledField label="Nome" hint="Aparece no cabeçalho e no painel da equipe.">
        <Input name="name" defaultValue={name} autoComplete="name" required minLength={2} maxLength={80} />
      </LabeledField>
      <LabeledField label="E-mail" hint="O e-mail da conta não pode ser trocado por aqui.">
        <Input value={email} readOnly disabled />
      </LabeledField>
      <SubmitButton size="default" pending={pending} pendingLabel="Salvando…" className="self-start">
        Salvar nome
      </SubmitButton>
    </form>
  )
}
