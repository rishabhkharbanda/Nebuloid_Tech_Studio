import type { Metadata } from 'next'
import { AboutSection } from '@/components/site/about-section'
import { BlogSection } from '@/components/site/blog-section'
import { DigitalCtaSection } from '@/components/site/digital-cta-section'
import { DigitalExperiencesSection } from '@/components/site/digital-experiences-section'
import { FaqSection } from '@/components/site/faq-section'
import { Footer } from '@/components/site/footer'
import { HeroSection } from '@/components/site/hero-section'
import { HomeScrollExplore } from '@/components/site/home-scroll-explore'
import { JsonLd } from '@/components/site/json-ld'
import { Navbar } from '@/components/site/navbar'
import { ServicesSection } from '@/components/site/services-section'
import { TestimonialsSection } from '@/components/site/testimonials-section'
import { TrustedBySection } from '@/components/site/trusted-by-section'
import { WorkSection } from '@/components/site/work-section'
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
        <div className="relative z-10 bg-[#090909]">
          <TrustedBySection />
          <ServicesSection limit={3} compact />
          <WorkSection limit={4} />
          <DigitalExperiencesSection variant="preview" />
          <AboutSection />
          <TestimonialsSection />
          <BlogSection limit={2} />
          <FaqSection limit={3} />
          <DigitalCtaSection />
        </div>
      </main>
      <Footer />
    </div>
  )
}
