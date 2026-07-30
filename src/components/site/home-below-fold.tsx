import { HomeBelowFoldClient } from '@/components/site/home-below-fold-client'
import { getDefaultBlogImageUrl, resolveBlogImage, resolveBlogImageAlt } from '@/lib/blog-image'
import { getBlogPostsForListing, getDigitalExperienceCards, getExperienceServices } from '@/lib/content'

export async function HomeBelowFold() {
  const [blogPosts, digitalCards, experienceServices, defaultImage] = await Promise.all([
    getBlogPostsForListing(),
    getDigitalExperienceCards(),
    getExperienceServices(),
    getDefaultBlogImageUrl(),
  ])

  return (
    <HomeBelowFoldClient
      digitalCards={digitalCards}
      experienceServices={experienceServices}
      blogPosts={blogPosts.map((post) => {
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
  )
}
