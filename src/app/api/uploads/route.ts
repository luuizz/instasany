import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { isMediaKind, MEDIA_RULES } from '@/lib/media'
import { getCurrentProfile } from '@/server/auth/session'
import { isStorageConfigured } from '@/server/integrations/storage'

// Libera o envio direto do navegador para o Vercel Blob (sem passar o arquivo pelo servidor).
// Só admin recebe o token, e só para os tipos e tamanhos do painel.
export async function POST(request: Request) {
  if (!isStorageConfigured()) return Response.json({ error: 'Upload indisponível neste ambiente.' }, { status: 503 })
  const body = (await request.json()) as HandleUploadBody

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const profile = await getCurrentProfile()
        if (profile?.role !== 'admin') throw new Error('Só administradores podem enviar arquivos.')
        if (!isMediaKind(clientPayload)) throw new Error('Tipo de arquivo inválido.')
        const rules = MEDIA_RULES[clientPayload]
        if (!pathname.startsWith(`${rules.folder}/`)) throw new Error('Pasta inválida.')
        return { allowedContentTypes: [...rules.accept], maximumSizeInBytes: rules.maxBytes, addRandomSuffix: true }
      },
    })
    return Response.json(result)
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Falha no upload.' }, { status: 400 })
  }
}
