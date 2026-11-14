import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SectionForm } from '@/components/admin/section-form'
import { findCmsSection } from '@/config/cms'
import { getPath } from '@/lib/object-path'
import { getSection } from '@/server/services/site-content'
import { resetSectionAction, saveSectionAction } from '../actions'

type PageProps = { params: Promise<{ secao: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return { title: findCmsSection((await params).secao)?.title ?? 'Conteúdo' }
}

const dateFormat = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
})

export default async function SectionEditorPage({ params }: PageProps) {
  const section = findCmsSection((await params).secao)
  if (!section) notFound()
  const { data, updatedAt } = await getSection(section.key)
  const values = Object.fromEntries(
    section.fields.map((field) => [field.path, String(getPath(data, field.path) ?? '')]),
  )

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold text-ink">{section.title}</h1>
      <p className="mt-2 text-ink/60">{section.description}</p>
      <p className="mt-1 text-sm text-ink/50">
        {updatedAt ? `Última alteração em ${dateFormat.format(updatedAt)}.` : 'Usando o conteúdo padrão.'}
      </p>
      <div className="mt-8">
        <SectionForm
          fields={section.fields}
          values={values}
          save={saveSectionAction.bind(null, section.key)}
          reset={resetSectionAction.bind(null, section.key)}
        />
      </div>
    </div>
  )
}
