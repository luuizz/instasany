'use client'

import { upload } from '@vercel/blob/client'
import { useRef, useState } from 'react'
import { FormMessage, Input } from '@/components/ui/field'
import { formatBytes, MEDIA_RULES, type MediaKind } from '@/lib/media'
import { slugify } from '@/lib/slug'

type MediaFieldProps = {
  name: string
  label: string
  kind: MediaKind
  defaultValue: string | null
  uploadsEnabled: boolean
  hint?: string
}

// Campo de arquivo do painel: envia para o Blob e guarda o endereço num campo do formulário
export function MediaField({ name, label, kind, defaultValue, uploadsEnabled, hint }: MediaFieldProps) {
  const rules = MEDIA_RULES[kind]
  const [url, setUrl] = useState(defaultValue ?? '')
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState('')
  const input = useRef<HTMLInputElement>(null)

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setError('')
    if (!(rules.accept as readonly string[]).includes(file.type)) return setError('Formato não aceito.')
    if (file.size > rules.maxBytes) return setError(`O arquivo pode ter até ${formatBytes(rules.maxBytes)}.`)
    const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
    const base = slugify(file.name.replace(/\.[^.]+$/, '')) || kind
    try {
      setProgress(0)
      const blob = await upload(`${rules.folder}/${base}.${extension}`, file, {
        access: 'public',
        handleUploadUrl: '/api/uploads',
        clientPayload: kind,
        multipart: file.size > 20 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      })
      setUrl(blob.url)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Não foi possível enviar o arquivo.')
    } finally {
      setProgress(null)
      if (input.current) input.current.value = ''
    }
  }

  return (
    <div role="group" aria-label={label} className="flex flex-col gap-2">
      <span className="text-sm font-semibold">{label}</span>
      <input type="hidden" name={name} value={url} />
      {url && kind === 'video' && (
        <video src={url} controls preload="metadata" className="aspect-video w-full rounded-2xl bg-ink" />
      )}
      {url && kind === 'image' && (
        // eslint-disable-next-line @next/next/no-img-element -- prévia de arquivo recém-enviado
        <img src={url} alt="" className="aspect-video w-full rounded-2xl object-cover" />
      )}
      {uploadsEnabled ? (
        <div className="flex flex-wrap items-center gap-3">
          <label className="cursor-pointer rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold hover:border-sage">
            {progress !== null ? `Enviando… ${progress}%` : url ? 'Trocar arquivo' : 'Escolher arquivo'}
            <input
              ref={input}
              type="file"
              accept={rules.accept.join(',')}
              className="sr-only"
              disabled={progress !== null}
              onChange={(event) => onFile(event.target.files?.[0])}
            />
          </label>
          {url && progress === null && (
            <button
              type="button"
              onClick={() => setUrl('')}
              className="cursor-pointer text-sm font-semibold text-red-700 hover:underline"
            >
              Remover
            </button>
          )}
          <span className="text-xs text-ink/50">
            {rules.accept.map((type) => type.split('/')[1]?.toUpperCase()).join(', ')} até {formatBytes(rules.maxBytes)}
          </span>
        </div>
      ) : (
        <Input
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://..."
          aria-label={label}
        />
      )}
      {hint && <span className="text-xs text-current/60">{hint}</span>}
      <FormMessage>{error}</FormMessage>
    </div>
  )
}
