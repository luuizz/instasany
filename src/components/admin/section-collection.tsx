import Link from 'next/link'
import { ChevronRightIcon } from 'lucide-react'
import type { CmsSection } from '@/config/cms'
import type { AdminView } from '@/lib/admin-view'
import { StatusBadge } from './status-badge'

type SectionItem = Pick<CmsSection, 'key' | 'title' | 'description'> & { updatedAt: Date | null }
type SectionCollectionProps = { sections: SectionItem[]; view: AdminView }

const dateFormat = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', timeZone: 'America/Sao_Paulo' })

const status = (section: SectionItem) =>
  section.updatedAt ? (
    <StatusBadge tone="live">Editada em {dateFormat.format(section.updatedAt)}</StatusBadge>
  ) : (
    <StatusBadge tone="muted">Conteúdo padrão</StatusBadge>
  )

// Seções da home em grade (cards numerados na ordem do site) ou lista
export function SectionCollection({ sections, view }: SectionCollectionProps) {
  if (view === 'grade') {
    return (
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {sections.map((section, index) => (
          <li
            key={section.key}
            style={{ animationDelay: `${index * 40}ms` }}
            className="animate-in duration-500 fill-mode-both fade-in slide-in-from-bottom-3"
          >
            <Link
              href={`/admin/conteudo/${section.key}`}
              className="group flex h-full flex-col gap-3 rounded-3xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-sage hover:shadow-xl"
            >
              <span className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-full bg-pine text-sm font-bold text-lime">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {status(section)}
              </span>
              <span className="text-lg font-semibold text-ink group-hover:underline">{section.title}</span>
              <span className="flex-1 text-sm text-ink/65">{section.description}</span>
              <span className="flex items-center gap-1 text-sm font-semibold text-pine">
                Editar
                <ChevronRightIcon className="size-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul className="animate-in divide-y divide-ink/10 overflow-hidden rounded-3xl border border-border bg-card duration-500 fade-in slide-in-from-bottom-2">
      {sections.map((section, index) => (
        <li key={section.key}>
          <Link
            href={`/admin/conteudo/${section.key}`}
            className="group flex items-center gap-4 px-5 py-4 transition hover:bg-sage-light/10"
          >
            <span className="w-6 shrink-0 text-sm font-bold text-sage">{String(index + 1).padStart(2, '0')}</span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-ink group-hover:underline">{section.title}</span>
              <span className="block truncate text-sm text-ink/65">{section.description}</span>
            </span>
            <span className="hidden sm:block">{status(section)}</span>
            <ChevronRightIcon className="size-4 shrink-0 text-ink/30 group-hover:text-pine" />
          </Link>
        </li>
      ))}
    </ul>
  )
}
