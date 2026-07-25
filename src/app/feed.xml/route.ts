import { getBlogPostsForListing } from '@/lib/content'
import { absoluteUrl, siteConfig } from '@/lib/seo'

export const revalidate = 60

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const posts = await getBlogPostsForListing()
  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/insights/${post.slug}`)
      const pubDate = new Date(post.dateModified || post.datePublished || Date.now()).toUTCString()
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.excerpt || post.metaDescription || '')}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(post.category || 'Insights')}</category>
    </item>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.shortName)} Blogs</title>
    <link>${absoluteUrl('/insights')}</link>
    <description>${escapeXml('Event technology, AI experiences, and digital activations from Nebuloid Tech Studio.')}</description>
    <language>en-in</language>
    <atom:link href="${absoluteUrl('/feed.xml')}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}
