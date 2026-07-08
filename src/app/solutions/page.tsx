import type { Metadata } from 'next'
import { ListingPage } from '@/components/site/listing-page'
import { PageShell } from '@/components/site/page-shell'
import { services } from '@/lib/site-data'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Event Solutions & Services',
  description:
    'Complete event ecosystem solutions — event branding, registration systems, interactive installations, AI experiences, event apps, and analytics by Nebuloid.',
  path: '/solutions',
  keywords: [
    'event branding services',
    'event registration systems India',
    'interactive event technology',
    'AI event experiences',
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
    </PageShell>
  )
}
