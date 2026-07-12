import type { Metadata } from 'next'
import { ListingPage } from '@/components/site/listing-page'
import { PageShell } from '@/components/site/page-shell'
import { getIndustryBySlug } from '@/lib/content'
import { industries } from '@/lib/site-data'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Industries We Serve',
  description:
    'Event experience and creative technology for entertainment, textile, tourism, tech, agriculture, religious, and more sectors across India.',
  path: '/industries',
  keywords: [
    'entertainment event technology',
    'tourism digital experience',
    'textile exhibition solutions',
  ],
})

export default function IndustriesIndexPage() {
  const items = industries.map((industry) => {
    const details = getIndustryBySlug(industry.slug)
    return {
      href: `/industries/${industry.slug}`,
      title: industry.title,
      category: 'Industry',
      description: details?.intro ?? industry.description,
      image: industry.image,
    }
  })

  return (
    <PageShell>
      <ListingPage
        label="Industries We Serve"
        title="Every industry has its own rhythm."
        description="Entertainment, textile, tourism, tech, agriculture, religious, and more — we design experiences that match the rhythm of your industry."
        items={items}
      />
    </PageShell>
  )
}
