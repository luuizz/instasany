'use client'

import { FileTextIcon, PlusIcon, Trash2Icon, UploadCloudIcon, XIcon } from 'lucide-react'
import { useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button, buttonVariants } from '@/components/ui/button'
import { ConfirmButton } from '@/components/ui/confirm-dialog'
import { FormMessage } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { fileKindLabel, formatBytes, MEDIA_LABELS, MEDIA_RULES } from '@/lib/media'
import type { ActionResult } from '@/lib/result'
import { cn } from '@/lib/utils'
import type { LessonAttachment } from '@/types/lms'
import { useMediaUpload, type UploadedFile } from './use-media-upload'

type NewAttachment = { title: string; url: string; sizeBytes: number; contentType: string }

type ManagerProps = {
  items: LessonAttachment[]
  uploadsEnabled: boolean
  add: (input: NewAttachment) => Promise<ActionResult<LessonAttachment>>
  remove: (attachmentId: number) => Promise<void>
}

const withoutExtension = (name: string) => name.replace(/\.[^.]+$/, '')

// Materiais de apoio da aula: cada arquivo enviado já fica salvo na aula
export function LessonAttachmentsManager({ items, uploadsEnabled, add, remove }: ManagerProps) {
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const input = useRef<HTMLInputElement>(null)

  const save = async (attachment: NewAttachment) => {
    setError(null)
    const result = await add(attachment)
    if (!result.ok) return setError(result.error)
    setTitle('')
    setLink('')
    toast.success('Material adicionado à aula.')
  }

  const onUploaded = (file: UploadedFile) =>
    save({
      title: title.trim() || withoutExtension(file.name),
      url: file.url,
      sizeBytes: file.size,
      contentType: file.type,
    })
  const upload = useMediaUpload('attachment', null, onUploaded)
  const uploading = upload.state.status === 'uploading' ? upload.state : null

  return (
    <div className="flex flex-col gap-5">
      {items.length === 0 ? (
        <p className="rounded-2xl bg-muted p-5 text-sm text-muted-foreground">Nenhum material nesta aula ainda.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 rounded-2xl border border-border p-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-pine">
                <FileTextIcon className="size-4" />
              </span>
              <a href={item.url} target="_blank" rel="noreferrer" className="min-w-0 flex-1 hover:underline">
                <span className="block truncate text-sm font-medium text-ink">{item.title}</span>
                <span className="block text-xs text-muted-foreground">
                  {fileKindLabel(item.contentType)}
                  {item.sizeBytes > 0 && ` · ${formatBytes(item.sizeBytes)}`}
                </span>
              </a>
              <form action={() => remove(item.id)}>
                <ConfirmButton
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remover ${item.title}`}
                  title={`Remover "${item.title}"?`}
                  description="O arquivo sai da aula e do armazenamento."
                  confirmLabel="Remover"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2Icon />
                </ConfirmButton>
              </form>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-border p-4">
        <FormMessage>{error ?? (upload.state.status === 'error' ? upload.state.message : null)}</FormMessage>
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={uploadsEnabled ? 'Nome do material (opcional)' : 'Nome do material'}
          aria-label="Nome do material"
          maxLength={120}
        />
        {uploadsEnabled ? (
          uploading ? (
            <div className="flex items-center gap-3 text-sm">
              <Progress value={uploading.percent} className="h-2" aria-label="Envio do arquivo" />
              <span className="w-10 text-right tabular-nums">{uploading.percent}%</span>
              <Button type="button" variant="ghost" size="icon-sm" onClick={upload.cancel} aria-label="Cancelar envio">
                <XIcon />
              </Button>
            </div>
          ) : (
            <label
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'cursor-pointer self-start focus-within:ring-4 focus-within:ring-ring/30',
              )}
            >
              <UploadCloudIcon />
              Enviar arquivo
              <input
                ref={input}
                type="file"
                className="sr-only"
                accept={MEDIA_RULES.attachment.accept.join(',')}
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) void upload.start(file)
                  event.target.value = ''
                }}
              />
            </label>
          )
        ) : (
          <div className="flex gap-2">
            <Input
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder="https://..."
              aria-label="Endereço do arquivo"
              type="url"
            />
            <Button
              type="button"
              variant="outline"
              disabled={pending || !title.trim() || !link.trim()}
              onClick={() => startTransition(() => save({ title, url: link, sizeBytes: 0, contentType: '' }))}
            >
              <PlusIcon />
              Adicionar
            </Button>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          {uploadsEnabled
            ? `${MEDIA_LABELS.attachment.formats}, até ${formatBytes(MEDIA_RULES.attachment.maxBytes)}.`
            : 'Envio de arquivos indisponível neste ambiente: informe o endereço de um arquivo já publicado.'}
        </p>
      </div>
    </div>
  )
}
