import type { Metadata } from 'next'
import { DigitalSolutionsSection } from '@/components/site/digital-solutions-section'
import { IndustriesSection } from '@/components/site/industries-section'
import { ListingPage } from '@/components/site/listing-page'
import { PageShell } from '@/components/site/page-shell'
import { TechnologySection } from '@/components/site/technology-section'
import { services } from '@/lib/site-data'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Event Solutions & Services',
  description:
    'Complete event ecosystem solutions — event branding, registration systems, interactive installations, AI experiences, capabilities, industries served, and technology by Nebuloid.',
  path: '/solutions',
  keywords: [
    'event branding services',
    'event registration systems India',
    'interactive event technology',
    'AI event experiences',
    'digital experience capabilities',
    'event technology stack',
  ],
})

export default function SolutionsIndexPage() {
  const items = services.map((service) => ({
    href: `/solutions/${service.slug}`,
    title: service.title,
    category: `Solution ${service.id}`,
    description: service.description,
    image: service.image,
    meta: service.tags.join(' · '),
  }))

  return (
    <PageShell>
      <ListingPage
        label="What We Create"
        title="One event ecosystem. Every layer connected."
        description="Branding, technology, and production — unified into a single experience that attendees feel from invitation to encore."
        items={items}
      />
      <DigitalSolutionsSection showViewAll={false} />
      <IndustriesSection showViewAll={false} />
      <TechnologySection showViewAll={false} />
    </PageShell>
  )
}
