'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { findCmsSection } from '@/config/cms'
import { setPath } from '@/lib/object-path'
import { fail, ok, type ActionResult } from '@/lib/result'
import { isSiteSectionKey, siteSectionSchemas } from '@/lib/validation/site-content'
import { requireAdmin } from '@/server/auth/session'
import { getSection, resetSection, saveSection, SITE_CONTENT_TAG } from '@/server/services/site-content'

export type SectionFormState = ActionResult<{ savedAt: string }> | null

function refreshSite() {
  revalidateTag(SITE_CONTENT_TAG, 'max')
  revalidatePath('/')
}

export async function saveSectionAction(
  key: string,
  _state: SectionFormState,
  formData: FormData,
): Promise<SectionFormState> {
  const profile = await requireAdmin()
  const section = findCmsSection(key)
  if (!section || !isSiteSectionKey(key)) return fail('Seção desconhecida.')

  // Parte do conteúdo atual e troca só os campos que o formulário edita
  let data: unknown = (await getSection(key)).data
  for (const field of section.fields) data = setPath(data, field.path, String(formData.get(field.path) ?? ''))

  const parsed = siteSectionSchemas[key].safeParse(data)
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? 'Confira os campos.')

  await saveSection(key, parsed.data, profile.id)
  refreshSite()
  return ok({ savedAt: new Date().toISOString() })
}

export async function resetSectionAction(key: string): Promise<ActionResult<unknown>> {
  await requireAdmin()
  if (!isSiteSectionKey(key)) return fail('Seção desconhecida.')
  await resetSection(key)
  refreshSite()
  return ok((await getSection(key)).data)
}
