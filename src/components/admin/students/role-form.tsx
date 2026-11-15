'use client'

import { setRoleAction } from '@/app/(admin)/admin/alunos/actions'
import { FormMessage } from '@/components/ui/form-field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SubmitButton } from '@/components/ui/submit-button'
import { useFormAction } from '@/hooks/use-form-action'
import type { ActionResult } from '@/lib/result'
import type { Role } from '@/types/students'
import { ROLE_LABELS } from './role-badge'

type RoleFormProps = { profileId: string; role: Role; isSelf: boolean }

// Papel da pessoa na plataforma; admin acessa o painel
export function RoleForm({ profileId, role, isSelf }: RoleFormProps) {
  const { state, onSubmit, pending } = useFormAction<ActionResult | null>(
    setRoleAction.bind(null, profileId),
    null,
    'Papel atualizado.',
  )

  if (isSelf)
    return <p className="text-sm text-muted-foreground">Esta é a sua conta: o seu papel não pode ser mudado aqui.</p>

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Select name="role" defaultValue={role}>
          <SelectTrigger aria-label="Papel" className="h-11 w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(ROLE_LABELS) as Role[]).map((value) => (
              <SelectItem key={value} value={value}>
                {ROLE_LABELS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <SubmitButton size="default" variant="outline" pending={pending} pendingLabel="Salvando…">
          Salvar papel
        </SubmitButton>
      </div>
      {state && !state.ok && <FormMessage>{state.error}</FormMessage>}
    </form>
  )
}
