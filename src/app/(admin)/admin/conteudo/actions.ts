'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { findCmsSection, type CmsField } from '@/config/cms'
import { readCmsForm } from '@/lib/cms-form'
import { fail, ok, type ActionResult } from '@/lib/result'
import { isSiteSectionKey, siteSectionSchemas } from '@/lib/validation/site-content'
import { requireAdmin } from '@/server/auth/session'
import { getSection, resetSection, saveSection, SITE_CONTENT_TAG } from '@/server/services/site-content'

export type SectionFormState = ActionResult<{ savedAt: string }> | null

type Issue = { message: string; path: PropertyKey[] } | undefined

// Erro dentro de uma lista ganha o nome do item: "Plano 2: Informe o preço em reais."
function issueMessage(fields: CmsField[], issue: Issue) {
  if (!issue) return 'Confira os campos.'
  const [listPath, index] = issue.path
  const list = fields.find((field) => field.kind === 'list' && field.path === listPath)
  return list?.kind === 'list' && typeof index === 'number'
    ? `${list.itemLabel} ${index + 1}: ${issue.message}`
    : issue.message
}

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

  const data = readCmsForm(section.fields, formData, (await getSection(key)).data)

  const parsed = siteSectionSchemas[key].safeParse(data)
  if (!parsed.success) return fail(issueMessage(section.fields, parsed.error.issues[0]))

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
