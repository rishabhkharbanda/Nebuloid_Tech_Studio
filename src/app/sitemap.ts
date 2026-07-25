import type { MetadataRoute } from 'next'
import {
  getAllBlogSlugs,
  getAllDigitalProjectSlugs,
  getAllIndustrySlugs,
  getAllProjectSlugs,
  getAllServiceSlugs,
  getAllTechnologySlugs,
  getBlogPostsForListing,
} from '@/lib/content'
import { getAllLocationLandingSlugs, resolveAllLocationLandingSlugs } from '@/lib/location-landings'
import { absoluteUrl } from '@/lib/seo'

const staticRoutes: MetadataRoute.Sitemap = [
  { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
  { url: absoluteUrl('/about'), changeFrequency: 'monthly', priority: 0.9 },
  { url: absoluteUrl('/solutions'), changeFrequency: 'weekly', priority: 0.9 },
  { url: absoluteUrl('/experiences'), changeFrequency: 'weekly', priority: 0.9 },
  { url: absoluteUrl('/digital-experiences'), changeFrequency: 'weekly', priority: 0.9 },
  { url: absoluteUrl('/capabilities'), changeFrequency: 'weekly', priority: 0.9 },
  { url: absoluteUrl('/insights'), changeFrequency: 'weekly', priority: 0.85 },
  { url: absoluteUrl('/industries'), changeFrequency: 'monthly', priority: 0.85 },
  { url: absoluteUrl('/technology'), changeFrequency: 'monthly', priority: 0.85 },
  { url: absoluteUrl('/process'), changeFrequency: 'monthly', priority: 0.75 },
  { url: absoluteUrl('/faq'), changeFrequency: 'monthly', priority: 0.75 },
  { url: absoluteUrl('/contact'), changeFrequency: 'monthly', priority: 0.9 },
  { url: absoluteUrl('/privacy'), changeFrequency: 'yearly', priority: 0.3 },
  { url: absoluteUrl('/terms'), changeFrequency: 'yearly', priority: 0.3 },
  { url: absoluteUrl('/feed.xml'), changeFrequency: 'daily', priority: 0.4 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fallbackDate = new Date()
  const [blogSlugs, digitalSlugs, blogPosts, locationSlugs] = await Promise.all([
    getAllBlogSlugs(),
    getAllDigitalProjectSlugs(),
    getBlogPostsForListing(),
    resolveAllLocationLandingSlugs(),
  ])
  const blogDates = new Map(
    blogPosts.map((post) => [
      post.slug,
      new Date(post.dateModified || post.datePublished || fallbackDate),
    ]),
  )

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...getAllProjectSlugs().map((slug) => ({
      url: absoluteUrl(`/experiences/${slug}`),
      lastModified: fallbackDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...digitalSlugs.map((slug) => ({
      url: absoluteUrl(`/digital-experiences/${slug}`),
      lastModified: fallbackDate,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
    ...getAllServiceSlugs().map((slug) => ({
      url: absoluteUrl(`/solutions/${slug}`),
      lastModified: fallbackDate,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
    ...blogSlugs.map((slug) => ({
      url: absoluteUrl(`/insights/${slug}`),
      lastModified: blogDates.get(slug) || fallbackDate,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    })),
    ...getAllIndustrySlugs().map((slug) => ({
      url: absoluteUrl(`/industries/${slug}`),
      lastModified: fallbackDate,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
    ...getAllTechnologySlugs().map((slug) => ({
      url: absoluteUrl(`/technology/${slug}`),
      lastModified: fallbackDate,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
    ...locationSlugs.map((slug) => ({
      url: absoluteUrl(`/${slug}`),
      lastModified: fallbackDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
  ]

  return [...staticRoutes, ...dynamicRoutes]
}
