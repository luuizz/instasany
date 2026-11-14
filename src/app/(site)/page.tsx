import { HeroSection } from '@/components/home/hero-section'
import { ShowcaseSection } from '@/components/home/showcase-section'
import { getHomeContent } from '@/server/services/site-content'

export default async function HomePage() {
  const content = await getHomeContent()
  return (
    <>
      <HeroSection content={content.hero} />
      <ShowcaseSection content={content.showcase} />
    </>
  )
}
