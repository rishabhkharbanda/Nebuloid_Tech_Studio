import type { Metadata } from 'next'
import { ListingPage } from '@/components/site/listing-page'
import { PageShell } from '@/components/site/page-shell'
import { getTechnologyBySlug } from '@/lib/content'
import { technologies } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Technology',
  description:
    'Event technology systems engineered by Nebuloid — kiosks, AI, navigation, registration, and live intelligence.',
}

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
