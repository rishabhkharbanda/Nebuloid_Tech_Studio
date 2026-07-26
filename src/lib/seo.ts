import type { Metadata } from 'next'

const CANONICAL_SITE_URL = 'https://www.nebuloidtechstudio.com'

/** Normalize env / legacy domains so sitemap + canonicals never drift off the live host. */
function resolveSiteUrl(raw?: string) {
  const fallback = CANONICAL_SITE_URL
  if (!raw) return fallback

  try {
    const parsed = new URL(raw.trim())
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase()

    // Legacy / wrong hosts must never ship in production metadata.
    if (host === 'nebuloid.tech' || host === 'nebuloidtechstudio.com') {
      return CANONICAL_SITE_URL
    }

    parsed.hash = ''
    parsed.search = ''
    return parsed.toString().replace(/\/+$/, '')
  } catch {
    return fallback
  }
}

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()

export const SITE_URL = resolveSiteUrl(configuredSiteUrl)

export const siteConfig = {
  name: 'Nebuloid Tech Studio LLP',
  shortName: 'Nebuloid Tech Studio',
  url: SITE_URL,
  locale: 'en_IN',
  defaultDescription:
    'Nebuloid Tech Studio designs, builds, and delivers complete event ecosystems — event branding, interactive installations, AI experiences, registration systems, and digital engagement for corporate events in India.',
  defaultKeywords: [
    'Nebuloid Tech Studio',
    'event experience company India',
    'creative technology events',
    'event branding Gurugram',
    'corporate event technology',
    'interactive event installations',
    'AI event experiences',
    'AI photo booth India',
    'AI photo booth for events',
    'digital experiences',
    'interactive kiosks',
    'experiential marketing',
    'brand activations',
    'conference branding',
    'event registration systems',
  ],
  defaultOgImage: '/assets/nebuloid-logo-mark.png',
  email: 'NebuloidTechStudio@gmail.com',
  phone: '+917303922260',
  address: {
    streetAddress: 'House No. 944, Block - C, Sushant Lok 1',
    addressLocality: 'Gurugram',
    addressRegion: 'Haryana',
    postalCode: '122001',
    addressCountry: 'IN',
  },
  social: {
    instagram: 'https://www.instagram.com/nebuloidstudio/',
    facebook: 'https://www.facebook.com/nebuloidtechstudio',
    linkedin: 'https://in.linkedin.com/company/nebuloid-tech-studio-llp',
    x: 'https://x.com/nebuloidtech',
  },
} as const

type PageMetadataOptions = {
  title: string
  description: string
  path: string
  keywords?: string[]
  image?: string
  type?: 'website' | 'article'
  noIndex?: boolean
  canonicalPath?: string
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
}

export function absoluteUrl(path: string) {
  return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  image,
  type = 'website',
  noIndex = false,
  canonicalPath,
  publishedTime,
  modifiedTime,
  authors,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(canonicalPath || path)
  const ogImage = image
    ? image.startsWith('http')
      ? image
      : absoluteUrl(image)
    : absoluteUrl(siteConfig.defaultOgImage)
  const mergedKeywords = [...new Set([...siteConfig.defaultKeywords, ...keywords])]

  return {
    title,
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical: url,
      types: {
        'application/rss+xml': absoluteUrl('/feed.xml'),
      },
    },
    openGraph: {
      title: `${title} | ${siteConfig.shortName}`,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article'
        ? {
            publishedTime,
            modifiedTime,
            authors: authors?.length ? authors : [siteConfig.name],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteConfig.shortName}`,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
  }
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': absoluteUrl('/#organization'),
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/assets/nebuloid-logo-mark.png'),
      width: 512,
      height: 512,
    },
    image: absoluteUrl('/assets/nebuloid-logo-mark.png'),
    description: siteConfig.defaultDescription,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      '@type': 'PostalAddress',
      ...siteConfig.address,
    },
    sameAs: Object.values(siteConfig.social),
    areaServed: ['IN', 'Worldwide'],
    knowsAbout: [
      'AI Photo Booth',
      'AI Photo Booth India',
      'Digital Experiences',
      'Interactive Kiosks',
      'Event Technology',
      'Experiential Marketing',
      'Brand Activations',
      'Corporate Event Technology',
    ],
  }
}

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': absoluteUrl('/#localbusiness'),
    name: siteConfig.name,
    url: siteConfig.url,
    image: absoluteUrl('/assets/nebuloid-logo-mark.png'),
    description: siteConfig.defaultDescription,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      ...siteConfig.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 28.4595,
      longitude: 77.0266,
    },
    areaServed: [
      { '@type': 'City', name: 'Gurugram' },
      { '@type': 'City', name: 'Delhi' },
      { '@type': 'City', name: 'Mumbai' },
      { '@type': 'City', name: 'Bengaluru' },
      { '@type': 'Country', name: 'India' },
    ],
    sameAs: Object.values(siteConfig.social),
    parentOrganization: { '@id': absoluteUrl('/#organization') },
  }
}

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.defaultDescription,
    inLanguage: 'en-IN',
    publisher: { '@id': absoluteUrl('/#organization') },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${absoluteUrl('/insights')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function getBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function getServiceSchema({
  name,
  description,
  path,
  image,
}: {
  name: string
  description: string
  path: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: absoluteUrl(path),
    image: image
      ? image.startsWith('http')
        ? image
        : absoluteUrl(image)
      : undefined,
    provider: { '@id': absoluteUrl('/#organization') },
    areaServed: ['IN', 'Worldwide'],
    serviceType: name,
  }
}

export function getArticleSchema({
  title,
  description,
  path,
  image,
  datePublished,
  dateModified,
  category,
  authorName,
}: {
  title: string
  description: string
  path: string
  image: string
  datePublished: string
  dateModified?: string
  category: string
  authorName?: string
}) {
  const imageUrl = image.startsWith('http') ? image : absoluteUrl(image)
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url: absoluteUrl(path),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(path),
    },
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
    },
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': authorName ? 'Person' : 'Organization',
      name: authorName || siteConfig.name,
      ...(authorName ? {} : { url: siteConfig.url }),
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/assets/nebuloid-logo-mark.png'),
      },
    },
    articleSection: category,
    inLanguage: 'en-IN',
  }
}

export function getFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function getContactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Nebuloid Tech Studio',
    url: absoluteUrl('/contact'),
    description:
      'Contact Nebuloid Tech Studio for AI photo booths, digital experiences, interactive kiosks, and corporate event technology across India.',
    mainEntity: { '@id': absoluteUrl('/#localbusiness') },
  }
}

export function getItemListSchema({
  name,
  description,
  path,
  items,
}: {
  name: string
  description: string
  path: string
  items: { name: string; path: string; description?: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: absoluteUrl(path),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
        description: item.description,
      })),
    },
  }
}

export function getPersonSchema(name: string, jobTitle = 'Editor') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    worksFor: { '@id': absoluteUrl('/#organization') },
  }
}

export function parseBlogDate(date: string) {
  const parsed = Date.parse(`${date} 1`)
  return Number.isNaN(parsed) ? new Date().toISOString() : new Date(parsed).toISOString()
}
