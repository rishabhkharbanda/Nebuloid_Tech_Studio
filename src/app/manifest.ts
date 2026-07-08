import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/seo'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.defaultDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#090909',
    theme_color: '#090909',
    lang: 'en',
    icons: [
      {
        src: '/assets/nebuloid-logo-mark.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
