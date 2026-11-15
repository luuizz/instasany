import 'server-only'
import { del } from '@vercel/blob'

// Arquivos do painel (vídeos das aulas e capas) ficam no Vercel Blob
export const isStorageConfigured = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN)

const isStoredFile = (url: string | null | undefined): url is string =>
  Boolean(url && /^https:\/\/[\w-]+\.public\.blob\.vercel-storage\.com\//.test(url))

// Apaga arquivos do Blob que deixaram de ser usados; endereços de fora são ignorados
export async function deleteStoredFiles(urls: (string | null | undefined)[]) {
  const stored = urls.filter(isStoredFile)
  if (!stored.length || !isStorageConfigured()) return
  try {
    await del(stored)
  } catch (error) {
    console.error('[storage] falha ao apagar arquivos:', error)
  }
}
