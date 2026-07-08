import type { Metadata } from 'next'
import { AboutSection } from '@/components/site/about-section'
import { BlogSection } from '@/components/site/blog-section'
import { FaqSection } from '@/components/site/faq-section'
import { Footer } from '@/components/site/footer'
import { HeroSection } from '@/components/site/hero-section'
import { IndustriesSection } from '@/components/site/industries-section'
import { JsonLd } from '@/components/site/json-ld'
import { Navbar } from '@/components/site/navbar'
import { ProcessSection } from '@/components/site/process-section'
import { ServicesSection } from '@/components/site/services-section'
import { StatsSection } from '@/components/site/stats-section'
import { TechnologySection } from '@/components/site/technology-section'
import { TestimonialsSection } from '@/components/site/testimonials-section'
import { TrustedBySection } from '@/components/site/trusted-by-section'
import { WorkSection } from '@/components/site/work-section'
import { createPageMetadata, getFaqSchema } from '@/lib/seo'
import { faqs } from '@/lib/site-data'

export const metadata: Metadata = createPageMetadata({
  title: 'Event Experience & Creative Technology Company in India',
  description:
    'Nebuloid Tech Studio designs complete event ecosystems — branding, interactive kiosks, AI experiences, registration systems, LED content, and digital engagement for corporate events, conferences, and brand activations.',
  path: '/',
  keywords: [
    'event experience company Gurugram',
    'corporate event creative technology',
    'event branding agency India',
    'interactive event solutions',
    'conference experience design',
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
        <TrustedBySection />
        <ServicesSection />
        <WorkSection />
        <IndustriesSection />
        <AboutSection />
        <ProcessSection />
        <TechnologySection />
        <StatsSection />
        <TestimonialsSection />
        <BlogSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  )
}
