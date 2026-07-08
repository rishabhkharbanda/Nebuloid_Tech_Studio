import type { Metadata } from 'next'
import { ListingPage } from '@/components/site/listing-page'
import { PageShell } from '@/components/site/page-shell'
import { getProjectBySlug } from '@/lib/content'
import { projects } from '@/lib/site-data'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Featured Event Experiences',
  description:
    'Explore corporate event experiences by Nebuloid — conferences, brand activations, AI installations, registration systems, and complete event ecosystems.',
  path: '/experiences',
  keywords: [
    'corporate event portfolio',
    'conference experience examples',
    'brand activation case studies',
  ],
})

export default function ExperiencesIndexPage() {
  const items = projects.map((project) => {
    const details = getProjectBySlug(project.slug)
    return {
      href: `/experiences/${project.slug}`,
      title: project.title,
      category: project.category,
      description: details?.intro ?? project.tech,
      image: project.image,
      meta: project.tech,
    }
  })

  return (
    <PageShell>
      <ListingPage
        label="Featured Experiences"
        title="Moments we designed, built, and brought to life."
        description="Corporate conferences, brand activations, AI experiences, and complete event ecosystems — each one crafted as a single seamless story."
        items={items}
      />
    </PageShell>
  )
}
