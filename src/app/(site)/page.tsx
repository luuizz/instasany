import { HeroSection } from '@/components/home/hero-section'
import { ShowcaseSection } from '@/components/home/showcase-section'
import { homeContent } from '@/data/home'

export default function HomePage() {
  return (
    <>
      <HeroSection content={homeContent.hero} />
      <ShowcaseSection content={homeContent.showcase} />
    </>
  )
}
