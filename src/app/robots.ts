import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/preview/', '/gone'],
      },
      {
        // Explicitly allow Google crawlers to fetch page assets (JS/CSS under /_next/).
        // Third-party DoubleClick Ads URLs are blocked by Google's own robots.txt — not ours.
        userAgent: 'Googlebot',
        allow: ['/', '/_next/'],
        disallow: ['/api/', '/admin/', '/preview/', '/gone'],
      },
      {
        userAgent: 'Google-InspectionTool',
        allow: ['/', '/_next/'],
        disallow: ['/api/', '/admin/', '/preview/', '/gone'],
      },
      {
        userAgent: 'GPTBot',
        allow: ['/', '/llms.txt', '/feed.xml', '/sitemap.xml'],
        disallow: ['/api/', '/admin/', '/preview/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  }
}
