import type { Metadata } from 'next'
import { ContactSection } from '@/components/site/contact-section'
import { PageShell } from '@/components/site/page-shell'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Start a creative collaboration with Nebuloid Tech Studio. Share your event vision and we will respond within one business day.',
}

export default function ContactPage() {
  return (
    <PageShell>
      <ContactSection />
    </PageShell>
  )
}
