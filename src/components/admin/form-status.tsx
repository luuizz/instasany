import { FormMessage } from '@/components/ui/field'
import type { ActionResult } from '@/lib/result'

// Aviso de erro ou de "salvo" devolvido por uma Server Action do painel
export function FormStatus({ state, success = 'Salvo!' }: { state: ActionResult<unknown> | null; success?: string }) {
  if (!state) return null
  return state.ok ? <FormMessage tone="success">{success}</FormMessage> : <FormMessage>{state.error}</FormMessage>
}
