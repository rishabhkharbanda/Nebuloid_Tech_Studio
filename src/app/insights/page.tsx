import type { Metadata } from 'next'
import { JsonLd } from '@/components/site/json-ld'
import { ListingPage } from '@/components/site/listing-page'
import { PageShell } from '@/components/site/page-shell'
import { getBlogPostsForListing } from '@/lib/content'
import { createPageMetadata, getBreadcrumbSchema, getItemListSchema } from '@/lib/seo'

/** Keep CMS publishes visible without a full redeploy. */
export const revalidate = 60

export const metadata: Metadata = createPageMetadata({
  title: 'Event Industry Insights',
  description:
    'Expert insights on event branding, corporate events, experiential marketing, AI for events, and creative technology from Nebuloid Tech Studio.',
  path: '/insights',
  keywords: [
    'event branding insights',
    'corporate event trends',
    'experiential marketing blog',
    'AI for events articles',
    'AI photo booth insights',
  ],
})

export default async function InsightsIndexPage() {
  const posts = await getBlogPostsForListing()
  const items = posts.map((post) => ({
    href: `/insights/${post.slug}`,
    title: post.title,
    category: post.category,
    description: post.excerpt,
    meta: `${post.date} · ${post.readTime}`,
  }))

  return (
    <PageShell>
      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blogs', path: '/insights' },
          ]),
          getItemListSchema({
            name: 'Nebuloid Blog Insights',
            description: 'Articles on event technology, AI experiences, and digital activations.',
            path: '/insights',
            items: posts.map((post) => ({
              name: post.title,
              path: `/insights/${post.slug}`,
              description: post.excerpt,
            })),
          }),
        ]}
      />
      <ListingPage
        label="Blogs"
        title="Thinking on events, experience, and creative technology."
        description="Perspectives on event branding, guest journeys, AI experiences, and the craft of designing memorable corporate events."
        items={items}
      />
    </PageShell>
  )
}
