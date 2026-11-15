'use client'

import { upload } from '@vercel/blob/client'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { checkMediaFile, MEDIA_LABELS, MEDIA_RULES, type MediaKind } from '@/lib/media'
import { slugify } from '@/lib/slug'

export type UploadState =
  { status: 'idle' } | { status: 'uploading'; file: File; percent: number } | { status: 'error'; message: string }

export type UploadedFile = { url: string; name: string; size: number; type: string }

// Envio direto do navegador para o Vercel Blob, com progresso e cancelamento.
// Com onUploaded, o arquivo é entregue a quem chamou (que salva na hora) em vez de virar o valor do campo.
export function useMediaUpload(
  kind: MediaKind,
  initialUrl: string | null,
  onUploaded?: (file: UploadedFile) => Promise<void>,
) {
  const [url, setUrl] = useState(initialUrl ?? '')
  const [state, setState] = useState<UploadState>({ status: 'idle' })
  const [lastFile, setLastFile] = useState<{ name: string; size: number } | null>(null)
  const controller = useRef<AbortController | null>(null)

  const start = async (file: File) => {
    const problem = checkMediaFile(kind, file)
    if (problem) return setState({ status: 'error', message: problem })

    const rules = MEDIA_RULES[kind]
    const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
    const base = slugify(file.name.replace(/\.[^.]+$/, '')) || kind
    controller.current = new AbortController()
    setState({ status: 'uploading', file, percent: 0 })
    try {
      const blob = await upload(`${rules.folder}/${base}.${extension}`, file, {
        access: 'public',
        handleUploadUrl: '/api/uploads',
        clientPayload: kind,
        multipart: file.size > 20 * 1024 * 1024,
        abortSignal: controller.current.signal,
        onUploadProgress: ({ percentage }) => setState({ status: 'uploading', file, percent: Math.round(percentage) }),
      })
      setState({ status: 'idle' })
      if (onUploaded) {
        await onUploaded({ url: blob.url, name: file.name, size: file.size, type: file.type })
        return
      }
      setUrl(blob.url)
      setLastFile({ name: file.name, size: file.size })
      toast.success(`${MEDIA_LABELS[kind].sent}. Salve para publicar.`)
    } catch (error) {
      if (controller.current?.signal.aborted) return setState({ status: 'idle' })
      setState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Não foi possível enviar o arquivo.',
      })
    } finally {
      controller.current = null
    }
  }

  const cancel = () => controller.current?.abort()
  const remove = () => {
    setUrl('')
    setLastFile(null)
    setState({ status: 'idle' })
  }

  return { url, setUrl, state, lastFile, start, cancel, remove }
}
