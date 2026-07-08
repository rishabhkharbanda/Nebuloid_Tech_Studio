import type { Metadata } from 'next'
import { ListingPage } from '@/components/site/listing-page'
import { PageShell } from '@/components/site/page-shell'
import { services } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Solutions',
  description:
    'Event ecosystem solutions from Nebuloid — branding, registration, interactive installations, AI, and analytics.',
}

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
