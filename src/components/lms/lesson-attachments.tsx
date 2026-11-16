import { DownloadIcon, FileTextIcon } from 'lucide-react'
import { fileKindLabel, formatBytes } from '@/lib/media'
import type { LessonAttachment } from '@/types/lms'

// Materiais de apoio da aula, para baixar
export function LessonAttachments({ items }: { items: LessonAttachment[] }) {
  if (items.length === 0) return null
  return (
    <section aria-labelledby="materiais" className="flex max-w-3xl flex-col gap-3">
      <h2 id="materiais" className="text-xl font-semibold text-ink">
        Materiais da aula
      </h2>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              download
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition hover:border-sage focus-visible:ring-4 focus-visible:ring-ring/30 focus-visible:outline-none"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-pine dark:text-lime">
                <FileTextIcon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-ink">{item.title}</span>
                <span className="block text-sm text-muted-foreground">
                  {fileKindLabel(item.contentType)}
                  {item.sizeBytes > 0 && ` · ${formatBytes(item.sizeBytes)}`}
                </span>
              </span>
              <DownloadIcon aria-hidden className="size-5 text-sage transition group-hover:text-pine" />
              <span className="sr-only">Baixar</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
