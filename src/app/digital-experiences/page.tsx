import type { Metadata } from 'next'
import { ListingPage } from '@/components/site/listing-page'
import { PageShell } from '@/components/site/page-shell'
import { digitalProjects } from '@/lib/digital-data'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Digital Experiences We\'ve Delivered',
  description:
    'Explore digital experience projects by Nebuloid — interactive visitor platforms, AI-powered event activations, touchscreen kiosks, government digital platforms, and immersive engagement systems.',
  path: '/digital-experiences',
  keywords: [
    'digital experience studio India',
    'interactive visitor experience',
    'AI event technology',
    'government digital platform',
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
        description="From AI-powered event activations and interactive visitor engagement to enterprise websites and digital transformation — technology that creates memorable experiences."
        items={items}
      />
    </PageShell>
  )
}
