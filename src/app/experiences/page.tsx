import type { Metadata } from 'next'
import { ListingPage } from '@/components/site/listing-page'
import { PageShell } from '@/components/site/page-shell'
import { getProjectBySlug } from '@/lib/content'
import { projects } from '@/lib/site-data'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Featured Event Experiences',
  description:
    'Explore deployed Nebuloid experiences — live AI activations, venue navigation, registration operations, and event intelligence from real-world executions.',
  path: '/experiences',
  keywords: [
    'corporate event portfolio',
    'event technology case studies',
    'deployed event experiences',
  ],
})

export default function ExperiencesIndexPage() {
  const items = projects.map((project) => {
    const details = getProjectBySlug(project.slug)
    return {
      href: `/experiences/${project.slug}`,
      title: project.title,
      category: project.category,
      description:
        details?.intro ??
        `${project.tech} — a live deployment crafted for real audiences and real venues.`,
      image: project.image,
      meta: project.tech,
    }
  })

  return (
    <PageShell>
      <ListingPage
        label="Deployed Experiences"
        title="Real implementations. Live audiences. Measurable outcomes."
        description="Case studies and on-ground deployments — not service menus. Each experience shows how Nebuloid technology performed in the room."
        items={items}
      />
    </PageShell>
  )
}
