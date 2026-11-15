'use client'

import { FileVideoIcon, ImageIcon, RefreshCwIcon, Trash2Icon, UploadCloudIcon, XIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { FormMessage, Input } from '@/components/ui/field'
import { Progress } from '@/components/ui/progress'
import { fileNameFromUrl, formatBytes, MEDIA_LABELS, MEDIA_RULES, type MediaKind } from '@/lib/media'
import { cn } from '@/lib/utils'
import { useMediaUpload } from './use-media-upload'

type MediaFieldProps = {
  name: string
  label: string
  kind: MediaKind
  defaultValue: string | null
  uploadsEnabled: boolean
  hint?: string
}

// Campo de arquivo do painel: arrastar e soltar, progresso, prévia; o endereço vai num campo oculto
export function MediaField({ name, label, kind, defaultValue, uploadsEnabled, hint }: MediaFieldProps) {
  const { url, setUrl, state, lastFile, start, cancel, remove } = useMediaUpload(kind, defaultValue)
  const [dragging, setDragging] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const rules = MEDIA_RULES[kind]
  const labels = MEDIA_LABELS[kind]
  const KindIcon = kind === 'video' ? FileVideoIcon : ImageIcon

  const pick = (files: FileList | null) => {
    const file = files?.[0]
    if (file) void start(file)
    if (input.current) input.current.value = ''
  }

  const fileInput = (
    <input
      ref={input}
      type="file"
      accept={rules.accept.join(',')}
      className="sr-only"
      onChange={(event) => pick(event.target.files)}
    />
  )

  return (
    <div role="group" aria-label={label} className="flex flex-col gap-2">
      <span className="text-sm font-semibold">{label}</span>
      <input type="hidden" name={name} value={url} />

      {!uploadsEnabled ? (
        <Input
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://..."
          aria-label={label}
        />
      ) : state.status === 'uploading' ? (
        <div className="flex animate-in items-center gap-4 rounded-3xl border border-border p-4 duration-200 fade-in">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-pine">
            <KindIcon className="size-5" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="truncate font-semibold">{state.file.name}</span>
              <span className="shrink-0 text-muted-foreground tabular-nums">
                {state.percent}% de {formatBytes(state.file.size)}
              </span>
            </div>
            <Progress value={state.percent} aria-label={`Enviando ${state.file.name}`} />
          </div>
          <Button type="button" variant="ghost" size="icon-sm" onClick={cancel} aria-label="Cancelar envio">
            <XIcon />
          </Button>
        </div>
      ) : url ? (
        <div className="flex animate-in flex-col overflow-hidden rounded-3xl border border-border duration-300 fade-in zoom-in-[0.98]">
          {kind === 'video' ? (
            <video src={url} controls preload="metadata" className="aspect-video w-full bg-ink" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- prévia do arquivo enviado (endereço do Blob)
            <img src={url} alt="" className="aspect-video w-full bg-muted object-cover" />
          )}
          <div className="flex flex-wrap items-center gap-3 p-4">
            <KindIcon className="size-4 shrink-0 text-sage" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {lastFile?.name ?? fileNameFromUrl(url)}
            </span>
            {lastFile && <span className="text-xs text-muted-foreground">{formatBytes(lastFile.size)}</span>}
            <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-semibold transition focus-within:ring-4 focus-within:ring-ring/30 hover:bg-accent">
              <RefreshCwIcon className="size-4" />
              Trocar
              {fileInput}
            </label>
            <Button type="button" variant="destructive" size="sm" onClick={remove}>
              <Trash2Icon />
              Remover
            </Button>
          </div>
        </div>
      ) : (
        <label
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            pick(event.dataTransfer.files)
          }}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-input px-6 py-10 text-center transition-all duration-200 focus-within:border-ring focus-within:ring-4 focus-within:ring-ring/20 hover:border-sage hover:bg-accent/50',
            dragging && 'scale-[1.01] border-sage bg-accent',
          )}
        >
          <span
            className={cn(
              'flex size-14 items-center justify-center rounded-full bg-secondary text-pine transition-transform duration-200',
              dragging && '-translate-y-1',
            )}
          >
            <UploadCloudIcon className="size-6" />
          </span>
          <span className="font-semibold">
            {dragging ? `Solte para enviar ${labels.the}` : `Arraste ${labels.the} aqui ou clique para escolher`}
          </span>
          <span className="text-sm text-muted-foreground">
            {labels.formats} até {formatBytes(rules.maxBytes)}
          </span>
          {fileInput}
        </label>
      )}

      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      <FormMessage>{state.status === 'error' ? state.message : null}</FormMessage>
    </div>
  )
}
