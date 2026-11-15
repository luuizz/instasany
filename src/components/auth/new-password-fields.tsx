import { LabeledField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { PASSWORD_MIN } from '@/lib/validation/auth'

// Senha nova + confirmação, usadas na redefinição e na troca pelo perfil
export function NewPasswordFields() {
  return (
    <>
      <LabeledField label="Senha nova" hint={`Pelo menos ${PASSWORD_MIN} caracteres.`}>
        <Input name="password" type="password" autoComplete="new-password" required minLength={PASSWORD_MIN} />
      </LabeledField>
      <LabeledField label="Repita a senha nova">
        <Input name="confirm" type="password" autoComplete="new-password" required minLength={PASSWORD_MIN} />
      </LabeledField>
    </>
  )
}
