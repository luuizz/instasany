import 'server-only'
import { eq } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'
import { homeContent } from '@/data/home'
import { siteSectionSchemas, type SiteSectionKey } from '@/lib/validation/site-content'
import type { HomeContent } from '@/types/home'
import { db, isDatabaseConfigured } from '../db/client'
import { siteSections } from '../db/schema'

export const SITE_CONTENT_TAG = 'site-content'

export type SectionState<K extends SiteSectionKey> = {
  data: HomeContent[K]
  updatedAt: Date | null
}

// Seção salva no banco; se não existe ou ficou fora do formato atual, vale o padrão
async function readSections() {
  const result = { ...homeContent } as HomeContent
  const updatedAt: Partial<Record<SiteSectionKey, Date>> = {}
  if (!isDatabaseConfigured()) return { content: result, updatedAt }

  const rows = await db().select().from(siteSections)
  for (const row of rows) {
    const key = row.key as SiteSectionKey
    const schema = siteSectionSchemas[key]
    if (!schema) continue
    const parsed = schema.safeParse(row.data)
    if (!parsed.success) {
      console.error('[cms] seção fora do formato, usando o padrão:', key, parsed.error.issues[0]?.message)
      continue
    }
    Object.assign(result, { [key]: parsed.data })
    updatedAt[key] = row.updatedAt
  }
  return { content: result, updatedAt }
}

// Leitura pública da home, em cache até o painel salvar uma seção
export const getHomeContent = unstable_cache(
  async (): Promise<HomeContent> => {
    try {
      return (await readSections()).content
    } catch (error) {
      console.error('[cms] falha ao ler o conteúdo, usando o padrão:', error)
      return homeContent
    }
  },
  ['home-content'],
  { tags: [SITE_CONTENT_TAG], revalidate: 3600 },
)

// Leitura do painel, sempre fresca
export async function getSection<K extends SiteSectionKey>(key: K): Promise<SectionState<K>> {
  const { content, updatedAt } = await readSections()
  return { data: content[key], updatedAt: updatedAt[key] ?? null }
}

export async function saveSection<K extends SiteSectionKey>(key: K, data: HomeContent[K], userId: string) {
  await db()
    .insert(siteSections)
    .values({ key, data, updatedBy: userId })
    .onConflictDoUpdate({ target: siteSections.key, set: { data, updatedBy: userId, updatedAt: new Date() } })
}

export async function resetSection(key: SiteSectionKey) {
  await db().delete(siteSections).where(eq(siteSections.key, key))
}
