import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { getHomeContent } from '@/server/services/site-content'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { footer } = await getHomeContent()
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter content={footer} />
    </>
  )
}
