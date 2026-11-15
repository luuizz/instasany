import { requireAdmin } from '@/server/auth/session'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { SectionForm } from '@/components/admin/section-form'
import { findCmsSection } from '@/config/cms'
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
  await requireAdmin('/admin/conteudo')
  const section = findCmsSection((await params).secao)
  if (!section) notFound()
  const { data, updatedAt } = await getSection(section.key)

  return (
    <div className="max-w-4xl">
      <PageHeader
        title={section.title}
        description={`${section.description} ${updatedAt ? `Última alteração em ${dateFormat.format(updatedAt)}.` : 'Usando o conteúdo padrão.'}`}
        breadcrumbs={[
          { href: '/admin', label: 'Painel' },
          { href: '/admin/conteudo', label: 'Conteúdo do site' },
        ]}
      />
      <div>
        <SectionForm
          fields={section.fields}
          data={data}
          save={saveSectionAction.bind(null, section.key)}
          reset={resetSectionAction.bind(null, section.key)}
        />
      </div>
    </div>
  )
}
