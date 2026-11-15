import { FormMessage } from '@/components/ui/form-field'
import type { ActionResult } from '@/lib/result'

// Erro devolvido por uma Server Action do painel (o sucesso aparece num toast)
export function FormStatus({ state }: { state: ActionResult<unknown> | null }) {
  return state?.ok === false ? <FormMessage>{state.error}</FormMessage> : null
}
