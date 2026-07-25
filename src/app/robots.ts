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
        userAgent: 'GPTBot',
        allow: ['/', '/llms.txt', '/feed.xml', '/sitemap.xml'],
        disallow: ['/api/', '/admin/', '/preview/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  }
}
