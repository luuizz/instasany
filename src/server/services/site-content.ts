import 'server-only'
import { eq } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'
import { homeContent } from '@/data/home'
import { siteSectionSchemas, type SiteSectionKey } from '@/lib/validation/site-content'
import type { HomeContent } from '@/types/home'
import { db, isDatabaseConfigured } from '../db/client'
import { siteSections } from '../db/schema'

export const SITE_CONTENT_TAG = 'site-content'

type StoredSection = { key: string; data: unknown; updatedAt: Date | string }

export type SectionState<K extends SiteSectionKey> = {
  data: HomeContent[K]
  updatedAt: Date | null
}

async function readRows(): Promise<StoredSection[]> {
  if (!isDatabaseConfigured()) return []
  return db()
    .select({ key: siteSections.key, data: siteSections.data, updatedAt: siteSections.updatedAt })
    .from(siteSections)
}

// O cache guarda só as linhas do banco; o encaixe nos padrões acontece a cada leitura,
// então seção nova ou formato novo nunca dependem de um cache antigo
const cachedRows = unstable_cache(readRows, ['site-sections'], { tags: [SITE_CONTENT_TAG], revalidate: 3600 })

// Seção salva no banco; se não existe ou ficou fora do formato atual, vale o padrão
function mergeWithDefaults(rows: StoredSection[]) {
  const content = { ...homeContent }
  const updatedAt: Partial<Record<SiteSectionKey, Date>> = {}
  for (const row of rows) {
    const key = row.key as SiteSectionKey
    const schema = siteSectionSchemas[key]
    if (!schema) continue
    const parsed = schema.safeParse(row.data)
    if (!parsed.success) {
      console.error('[cms] seção fora do formato, usando o padrão:', key, parsed.error.issues[0]?.message)
      continue
    }
    Object.assign(content, { [key]: parsed.data })
    updatedAt[key] = new Date(row.updatedAt)
  }
  return { content, updatedAt }
}

// Leitura pública do site, em cache até o painel salvar uma seção
export async function getHomeContent(): Promise<HomeContent> {
  try {
    return mergeWithDefaults(await cachedRows()).content
  } catch (error) {
    console.error('[cms] falha ao ler o conteúdo, usando o padrão:', error)
    return homeContent
  }
}

// Leitura do painel, sempre fresca
export async function getSection<K extends SiteSectionKey>(key: K): Promise<SectionState<K>> {
  const { content, updatedAt } = mergeWithDefaults(await readRows())
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

// Quando cada seção foi salva no painel (sem data = ainda usa o conteúdo padrão)
export async function getSectionUpdates(): Promise<Partial<Record<SiteSectionKey, Date>>> {
  return mergeWithDefaults(await readRows()).updatedAt
}
