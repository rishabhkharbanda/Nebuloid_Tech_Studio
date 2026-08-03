import { config } from 'dotenv'
config({ path: '.env.local' })

import {
  delhiExpoBlogToHtml,
  delhiExpoBlogs2026,
  estimateWordCount,
} from '../src/lib/delhi-expo-blogs-2026'
import { listBlogPostsCms, upsertBlogPostCms } from '../src/lib/cms/queries'

async function main() {
  const existing = await listBlogPostsCms()
  const bySlug = new Map(existing.map((row) => [row.slug, row]))
  let created = 0
  let updated = 0

  for (const post of delhiExpoBlogs2026) {
    const words = estimateWordCount(post)
    if (words < 1500) {
      throw new Error(`${post.slug} has only ${words} words (need >= 1500)`)
    }

    const bodyHtml = delhiExpoBlogToHtml(post)
    const current = bySlug.get(post.slug)

    await upsertBlogPostCms(current?.id ?? null, {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      body: bodyHtml,
      bodyHtml,
      featuredImageUrl: post.featuredImageUrl,
      featuredImageAlt: post.featuredImageAlt,
      category: post.category,
      tags: post.tags,
      status: 'published',
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      focusKeyword: post.focusKeyword,
      canonicalPath: `/insights/${post.slug}`,
      ogImageUrl: post.featuredImageUrl,
      twitterImageUrl: post.featuredImageUrl,
      robotsIndex: true,
      authorName: 'Nebuloid Tech Studio',
      schemaType: 'BlogPosting',
      displayDate: post.displayDate,
    })

    if (current) updated += 1
    else created += 1
    console.log(
      `${current ? 'updated' : 'created'}: ${post.slug} (${words} words, ${post.paragraphs.length} paras)`,
    )
  }

  console.log(
    `Done. created=${created} updated=${updated} total=${delhiExpoBlogs2026.length}`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
