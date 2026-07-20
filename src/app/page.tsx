import type { Metadata } from 'next'
import { Footer } from '@/components/site/footer'
import { HeroSection } from '@/components/site/hero-section'
import { HomeBelowFold } from '@/components/site/home-below-fold'
import { HomeScrollExplore } from '@/components/site/home-scroll-explore'
import { JsonLd } from '@/components/site/json-ld'
import { Navbar } from '@/components/site/navbar'
import { createPageMetadata, getFaqSchema } from '@/lib/seo'
import { faqs } from '@/lib/site-data'

export const metadata: Metadata = createPageMetadata({
  title: 'Digital Experience & Event Technology Studio in India',
  description:
    'Nebuloid Tech Studio builds interactive visitor experiences, AI-powered event activations, touchscreen kiosks, government digital platforms, and immersive digital storytelling for organisations worldwide.',
  path: '/',
  keywords: [
    'digital experience studio India',
    'event technology company Gurugram',
    'interactive visitor experience',
    'AI selfie booth development',
    'government digital platform',
    'touchscreen kiosk software',
  ],
})

export default function Home() {
  return (
    <div className="relative overflow-clip bg-[#090909] text-[#F1E9DB]">
      <JsonLd data={getFaqSchema([...faqs])} />
      <div className="grain-overlay" />
      <Navbar />
      <main>
        <HeroSection />
        <HomeScrollExplore />
        <HomeBelowFold />
      </main>
      <Footer />
    </div>
  )
}
