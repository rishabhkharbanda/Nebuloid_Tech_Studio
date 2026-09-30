import type { Metadata } from 'next'
import { JsonLd } from '@/components/site/json-ld'
import { InsightsListing } from '@/components/site/insights-listing'
import { PageShell } from '@/components/site/page-shell'
import { getBlogPostsForListingCached } from '@/lib/cms/cached-content'
import { getDefaultBlogImageUrl, resolveBlogImage, resolveBlogImageAlt } from '@/lib/blog-image'
import { createPageMetadata, getBreadcrumbSchema, getItemListSchema } from '@/lib/seo'

/** Keep CMS publishes visible without a full redeploy. */
export const revalidate = 86400

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

type PageProps = {
  searchParams: Promise<{ category?: string; q?: string }>
}

export default async function InsightsIndexPage({ searchParams }: PageProps) {
  const posts = await getBlogPostsForListingCached()
  const params = await searchParams
  const initialCategory = params.category?.trim() || 'All'
  const defaultImage = await getDefaultBlogImageUrl()

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
      <InsightsListing
        initialCategory={initialCategory}
        posts={posts.map((post) => {
          const rawImage = post.image || post.ogImageUrl || undefined
          return {
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            date: post.date,
            category: post.category,
            readTime: post.readTime,
            image: resolveBlogImage(rawImage, defaultImage),
            imageAlt: resolveBlogImageAlt(rawImage, post.imageAlt, post.title),
          }
        })}
      />
    </PageShell>
  )
}
