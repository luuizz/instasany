'use server'

import { revalidatePath } from 'next/cache'
import { fail, ok, type ActionResult } from '@/lib/result'
import { roleSchema } from '@/lib/validation/analytics'
import { requireAdmin } from '@/server/auth/session'
import { OwnRoleError, setRole } from '@/server/services/students'

export async function setRoleAction(
  profileId: string,
  _state: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const admin = await requireAdmin()
  const parsed = roleSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? 'Papel inválido.')
  try {
    if (!(await setRole(admin.id, profileId, parsed.data.role))) return fail('Pessoa não encontrada.')
  } catch (error) {
    if (error instanceof OwnRoleError) return fail(error.message)
    throw error
  }
  revalidatePath('/admin/alunos', 'layout')
  return ok(undefined)
}
