import type { Metadata } from 'next'
import { ListingPage } from '@/components/site/listing-page'
import { PageShell } from '@/components/site/page-shell'
import { blogPosts } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Insights',
  description:
    'Thinking on events, experience, and creative technology from Nebuloid Tech Studio.',
}

export default function InsightsIndexPage() {
  const items = blogPosts.map((post) => ({
    href: `/insights/${post.slug}`,
    title: post.title,
    category: post.category,
    description: post.excerpt,
    meta: `${post.date} · ${post.readTime}`,
  }))

  return (
    <PageShell>
      <ListingPage
        label="Insights"
        title="Thinking on events, experience, and creative technology."
        description="Perspectives on event branding, guest journeys, AI experiences, and the craft of designing memorable corporate events."
        items={items}
      />
    </PageShell>
  )
}
