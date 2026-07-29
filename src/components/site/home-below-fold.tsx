import { HomeBelowFoldClient } from '@/components/site/home-below-fold-client'
import { getBlogPostsForListing, getDigitalExperienceCards, getExperienceServices } from '@/lib/content'

export async function HomeBelowFold() {
  const [blogPosts, digitalCards, experienceServices] = await Promise.all([
    getBlogPostsForListing(),
    getDigitalExperienceCards(),
    getExperienceServices(),
  ])

  return (
    <HomeBelowFoldClient
      digitalCards={digitalCards}
      experienceServices={experienceServices}
      blogPosts={blogPosts.map((post) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        category: post.category,
        readTime: post.readTime,
        image: post.image || post.ogImageUrl || undefined,
        imageAlt: post.imageAlt || post.title,
      }))}
    />
  )
}
