import type { MetadataRoute } from 'next'
import {
  getAllBlogSlugs,
  getAllDigitalProjectSlugs,
  getAllIndustrySlugs,
  getAllProjectSlugs,
  getAllServiceSlugs,
  getAllTechnologySlugs,
} from '@/lib/content'
import { absoluteUrl } from '@/lib/seo'

const staticRoutes: MetadataRoute.Sitemap = [
  { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
  { url: absoluteUrl('/about'), changeFrequency: 'monthly', priority: 0.9 },
  { url: absoluteUrl('/solutions'), changeFrequency: 'weekly', priority: 0.9 },
  { url: absoluteUrl('/experiences'), changeFrequency: 'weekly', priority: 0.9 },
  { url: absoluteUrl('/digital-experiences'), changeFrequency: 'weekly', priority: 0.9 },
  { url: absoluteUrl('/insights'), changeFrequency: 'weekly', priority: 0.85 },
  { url: absoluteUrl('/industries'), changeFrequency: 'monthly', priority: 0.85 },
  { url: absoluteUrl('/technology'), changeFrequency: 'monthly', priority: 0.85 },
  { url: absoluteUrl('/process'), changeFrequency: 'monthly', priority: 0.75 },
  { url: absoluteUrl('/faq'), changeFrequency: 'monthly', priority: 0.75 },
  { url: absoluteUrl('/contact'), changeFrequency: 'monthly', priority: 0.9 },
  { url: absoluteUrl('/privacy'), changeFrequency: 'yearly', priority: 0.3 },
  { url: absoluteUrl('/terms'), changeFrequency: 'yearly', priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...getAllProjectSlugs().map((slug) => ({
      url: absoluteUrl(`/experiences/${slug}`),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...getAllDigitalProjectSlugs().map((slug) => ({
      url: absoluteUrl(`/digital-experiences/${slug}`),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
    ...getAllServiceSlugs().map((slug) => ({
      url: absoluteUrl(`/solutions/${slug}`),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
    ...getAllBlogSlugs().map((slug) => ({
      url: absoluteUrl(`/insights/${slug}`),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...getAllIndustrySlugs().map((slug) => ({
      url: absoluteUrl(`/industries/${slug}`),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
    ...getAllTechnologySlugs().map((slug) => ({
      url: absoluteUrl(`/technology/${slug}`),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ]

  return [...staticRoutes, ...dynamicRoutes]
}
