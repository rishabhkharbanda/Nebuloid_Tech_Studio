import type { Metadata } from 'next'
import { ListingPage } from '@/components/site/listing-page'
import { PageShell } from '@/components/site/page-shell'
import { digitalProjects } from '@/lib/digital-data'
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

export default function DigitalExperiencesIndexPage() {
  const items = digitalProjects.map((project) => ({
    href: `/digital-experiences/${project.slug}`,
    title: project.title,
    category: project.category,
    description: project.overview,
    image: project.image,
    meta: project.client,
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
