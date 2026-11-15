import { PageHeader } from '@/components/admin/page-header'
import { SectionCollection } from '@/components/admin/section-collection'
import { ViewToggle } from '@/components/admin/view-toggle'
import { cmsSections } from '@/config/cms'
import { getAdminView } from '@/server/admin-view'
import { getSectionUpdates } from '@/server/services/site-content'

export default async function AdminHomePage() {
  const [view, updates] = await Promise.all([getAdminView(), getSectionUpdates()])
  const sections = cmsSections.map(({ key, title, description }) => ({
    key,
    title,
    description,
    updatedAt: updates[key] ?? null,
  }))
  const edited = sections.filter((section) => section.updatedAt).length

  return (
    <div className="max-w-6xl">
      <PageHeader
        title="Conteúdo do site"
        description={`${sections.length} seções da home, ${edited} editadas no painel. As mudanças aparecem no site assim que você salva.`}
        actions={<ViewToggle view={view} />}
      />
      <SectionCollection sections={sections} view={view} />
    </div>
  )
}
