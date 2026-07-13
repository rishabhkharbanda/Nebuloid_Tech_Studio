import type { Metadata } from 'next'
import { AboutSection } from '@/components/site/about-section'
import { AppleScrollSequence } from '@/components/site/apple-scroll-sequence'
import { BlogSection } from '@/components/site/blog-section'
import { DigitalCtaSection } from '@/components/site/digital-cta-section'
import { DigitalExperiencesSection } from '@/components/site/digital-experiences-section'
import { DigitalImpactStatsSection } from '@/components/site/digital-impact-stats-section'
import { DigitalSolutionsSection } from '@/components/site/digital-solutions-section'
import { FaqSection } from '@/components/site/faq-section'
import { Footer } from '@/components/site/footer'
import { HeroSection } from '@/components/site/hero-section'
import { IndustriesSection } from '@/components/site/industries-section'
import { JsonLd } from '@/components/site/json-ld'
import { Navbar } from '@/components/site/navbar'
import { ServicesSection } from '@/components/site/services-section'
import { TechnologySection } from '@/components/site/technology-section'
import { TestimonialsSection } from '@/components/site/testimonials-section'
import { TrustedBySection } from '@/components/site/trusted-by-section'
import { WorkSection } from '@/components/site/work-section'
import { createPageMetadata, getFaqSchema } from '@/lib/seo'
import { faqs } from '@/lib/site-data'

export const metadata: Metadata = createPageMetadata({
  title: 'Digital Experience & Event Technology Studio in India',
  description:
    'Nebuloid Tech Studio builds interactive visitor experiences, AI-powered event activations, touchscreen kiosks, government digital platforms, and immersive digital storytelling for organizations worldwide.',
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
        <AppleScrollSequence />
        <TrustedBySection />
        <ServicesSection limit={3} compact />
        <WorkSection limit={4} />
        <DigitalExperiencesSection variant="preview" />
        <DigitalSolutionsSection limit={6} />
        <AboutSection />
        <IndustriesSection limit={3} />
        <TechnologySection limit={8} />
        <DigitalImpactStatsSection />
        <TestimonialsSection />
        <BlogSection limit={2} />
        <FaqSection limit={3} />
        <DigitalCtaSection />
      </main>
      <Footer />
    </div>
  )
}
