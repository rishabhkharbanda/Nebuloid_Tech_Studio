import type { Metadata } from 'next'
import { ListingPage } from '@/components/site/listing-page'
import { PageShell } from '@/components/site/page-shell'
import { getDigitalExperienceCards } from '@/lib/content'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Digital Experiences We\'ve Delivered',
  description:
    'Explore Nebuloid digital projects — BharatTex, FILBo, and Paras Dham — interactive platforms, AI activations, and immersive visitor experiences.',
  path: '/digital-experiences',
  keywords: [
    'digital experience studio India',
    'BharatTex digital experience',
    'FILBo AI experience',
    'interactive visitor experience',
    'touchscreen kiosk development',
  ],
})

export default async function DigitalExperiencesIndexPage() {
  const cards = await getDigitalExperienceCards()
  const items = cards.map((card) => ({
    href: card.ctaHref || `/digital-experiences/${card.slug}`,
    title: card.title,
    category: card.category,
    description: card.overview,
    image: card.image,
    meta: card.client,
  }))

  return (
    <PageShell>
      <ListingPage
        label="Digital Experiences"
        title="Digital experiences we've delivered."
        description="BharatTex, FILBo, and Paras Dham — real deployments where Nebuloid technology shaped visitor journeys on the ground."
        items={items}
      />
    </PageShell>
  )
}
