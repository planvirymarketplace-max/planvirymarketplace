'use client'

import { HeroSection } from '@/components/marketplace/home/hero-section'
import { SpotlightPartners } from '@/components/marketplace/home/spotlight-partners'
import { FeaturesSection } from '@/components/marketplace/home/features-section'
import { MarketplaceSection } from '@/components/marketplace/home/marketplace-section'

export function HomeView() {
  return (
    <div>
      <HeroSection />
      <SpotlightPartners />
      <FeaturesSection />
      <MarketplaceSection />
    </div>
  )
}
