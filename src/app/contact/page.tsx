import type { Metadata } from 'next'
import { ContactSection } from '@/components/site/contact-section'
import { Footer } from '@/components/site/footer'
import { Navbar } from '@/components/site/navbar'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Start a creative collaboration with Nebuloid Tech Studio. Share your event vision and we will respond within one business day.',
}

export default function ContactPage() {
  return (
    <div className="relative overflow-clip bg-[#090909] text-[#F1E9DB]">
      <div className="grain-overlay" />
      <Navbar />
      <main className="pt-28">
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
