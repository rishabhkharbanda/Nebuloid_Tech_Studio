import { AboutSection } from '@/components/site/about-section'
import { BlogSection } from '@/components/site/blog-section'
import { ContactSection } from '@/components/site/contact-section'
import { FaqSection } from '@/components/site/faq-section'
import { Footer } from '@/components/site/footer'
import { HeroSection } from '@/components/site/hero-section'
import { IndustriesSection } from '@/components/site/industries-section'
import { Navbar } from '@/components/site/navbar'
import { ProcessSection } from '@/components/site/process-section'
import { ServicesSection } from '@/components/site/services-section'
import { StatsSection } from '@/components/site/stats-section'
import { TechnologySection } from '@/components/site/technology-section'
import { TestimonialsSection } from '@/components/site/testimonials-section'
import { TrustedBySection } from '@/components/site/trusted-by-section'
import { WorkSection } from '@/components/site/work-section'

export default function Home() {
  return (
    <div className="relative overflow-clip bg-[#090909] text-[#F1E9DB]">
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
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
