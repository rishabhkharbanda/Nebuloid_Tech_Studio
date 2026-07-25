import type { Metadata } from 'next'
import { JsonLd } from '@/components/site/json-ld'
import { DigitalSolutionsSection } from '@/components/site/digital-solutions-section'
import { IndustriesSection } from '@/components/site/industries-section'
import { ListingPage } from '@/components/site/listing-page'
import { PageShell } from '@/components/site/page-shell'
import { services } from '@/lib/site-data'
import { createPageMetadata, getBreadcrumbSchema, getItemListSchema } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Event Solutions & Services',
  description:
    'Nebuloid Tech Studio solutions — event branding, registration systems, interactive installations, AI experiences, analytics, and the capabilities behind every engagement layer.',
  path: '/solutions',
  keywords: [
    'event branding services',
    'event registration systems India',
    'interactive event technology',
    'AI event experiences',
    'AI photo booth for events',
    'digital experience capabilities',
  ],
})

export default function SolutionsIndexPage() {
  const items = services.map((service) => ({
    href: `/solutions/${service.slug}`,
    title: service.title,
    category: `Capability ${service.id}`,
    description: service.description,
    image: service.image,
    meta: service.tags.join(' · '),
  }))

  return (
    <PageShell>
      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Solutions', path: '/solutions' },
          ]),
          getItemListSchema({
            name: 'Nebuloid Solutions',
            description: 'Event technology and experience services.',
            path: '/solutions',
            items: services.map((service) => ({
              name: service.title,
              path: `/solutions/${service.slug}`,
              description: service.description,
            })),
          }),
        ]}
      />
      <ListingPage
        label="Solutions"
        title="Services that power complete event ecosystems."
        description="A clear map of what Nebuloid builds — branding, technology, and engagement systems explained by capability, not by case study."
        items={items}
      />
      <DigitalSolutionsSection showViewAll={false} />
      <IndustriesSection showViewAll={false} />
    </PageShell>
  )
}
