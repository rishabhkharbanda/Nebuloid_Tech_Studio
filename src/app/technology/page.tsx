import type { Metadata } from 'next'
import { ListingPage } from '@/components/site/listing-page'
import { PageShell } from '@/components/site/page-shell'
import { getTechnologyBySlug } from '@/lib/content'
import { technologies } from '@/lib/site-data'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Event Technology Systems',
  description:
    'Event technology by Nebuloid — touchscreen kiosks, QR check-in, AI photo booths, LED content, venue navigation, event apps, and live dashboards.',
  path: '/technology',
  keywords: [
    'event technology India',
    'touchscreen kiosk events',
    'QR check-in corporate events',
    'event live dashboards',
  ],
})

export default function TechnologyIndexPage() {
  const items = technologies.map((tech) => {
    const details = getTechnologyBySlug(tech.slug)
    return {
      href: `/technology/${tech.slug}`,
      title: tech.title,
      category: 'Technology',
      description: details?.intro ?? '',
      image: tech.image,
    }
  })

  return (
    <PageShell>
      <ListingPage
        label="Technology"
        title="The invisible layer behind every moment."
        description="We engineer the systems behind the experience — so your audience never sees the seams."
        items={items}
      />
    </PageShell>
  )
}
