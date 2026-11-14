import { AboutSection } from '@/components/home/about-section'
import { AudienceSection } from '@/components/home/audience-section'
import { BenefitsSection } from '@/components/home/benefits-section'
import { FaqSection } from '@/components/home/faq-section'
import { HeroSection } from '@/components/home/hero-section'
import { PricingSection } from '@/components/home/pricing-section'
import { ShowcaseSection } from '@/components/home/showcase-section'
import { getHomeContent } from '@/server/services/site-content'

export default async function HomePage() {
  const content = await getHomeContent()
  return (
    <>
      <HeroSection content={content.hero} />
      <ShowcaseSection content={content.showcase} />
      <BenefitsSection content={content.benefits} />
      <AudienceSection content={content.audience} />
      <PricingSection content={content.pricing} />
      <AboutSection content={content.about} />
      <FaqSection content={content.faq} />
    </>
  )
}
