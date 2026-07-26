import { HomeBelowFoldClient } from '@/components/site/home-below-fold-client'
import { getBlogPostsForListing, getDigitalExperienceCards } from '@/lib/content'

export async function HomeBelowFold() {
  const [blogPosts, digitalCards] = await Promise.all([
    getBlogPostsForListing(),
    getDigitalExperienceCards(),
  ])

  return (
    <HomeBelowFoldClient
      digitalCards={digitalCards}
      blogPosts={blogPosts.map((post) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        category: post.category,
        readTime: post.readTime,
      }))}
    />
  )
}
