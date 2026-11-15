'use client'

import { updateProfileAction } from '@/app/(aluno)/aluno/perfil/actions'
import { FormMessage, LabeledField } from '@/components/ui/form-field'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { SubmitButton } from '@/components/ui/submit-button'
import { useFormAction } from '@/hooks/use-form-action'
import type { ActionResult } from '@/lib/result'

type ProfileFormProps = { name: string; email: string; emailReminders: boolean }

export function ProfileForm({ name, email, emailReminders }: ProfileFormProps) {
  const { state, onSubmit, pending } = useFormAction<ActionResult | null>(updateProfileAction, null, 'Dados salvos.')

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <FormMessage>{state?.ok === false ? state.error : null}</FormMessage>
      <LabeledField label="Nome" hint="Aparece no cabeçalho e no painel da equipe.">
        <Input name="name" defaultValue={name} autoComplete="name" required minLength={2} maxLength={80} />
      </LabeledField>
      <LabeledField label="E-mail" hint="O e-mail da conta não pode ser trocado por aqui.">
        <Input value={email} readOnly disabled />
      </LabeledField>
      <Field orientation="horizontal" className="items-start gap-3">
        <Switch id="lembretes" name="emailReminders" defaultChecked={emailReminders} />
        <FieldContent>
          <FieldLabel htmlFor="lembretes">Lembretes por e-mail</FieldLabel>
          <FieldDescription>Um aviso quando você passa uma semana sem abrir um curso que começou.</FieldDescription>
        </FieldContent>
      </Field>
      <SubmitButton size="default" pending={pending} pendingLabel="Salvando…" className="self-start">
        Salvar
      </SubmitButton>
    </form>
  )
}
