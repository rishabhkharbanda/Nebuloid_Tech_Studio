import type { Metadata } from 'next'
import { ContactSection } from '@/components/site/contact-section'
import { JsonLd } from '@/components/site/json-ld'
import { PageShell } from '@/components/site/page-shell'
import {
  createPageMetadata,
  getBreadcrumbSchema,
  getContactPageSchema,
  getLocalBusinessSchema,
} from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Contact Us',
  description:
    'Contact Nebuloid Tech Studio to start your next corporate event, conference, or brand activation. Based in Gurugram, serving clients across India.',
  path: '/contact',
  keywords: [
    'contact event agency Gurugram',
    'hire event technology company',
    'corporate event quote India',
    'AI photo booth booking India',
  ],
})

export default function ContactPage() {
  return (
    <PageShell>
      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
          getContactPageSchema(),
          getLocalBusinessSchema(),
        ]}
      />
      <ContactSection />
    </PageShell>
  )
}
