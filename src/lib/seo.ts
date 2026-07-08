import type { Metadata } from 'next'

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nebuloid.tech'

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
    'conference branding',
    'event registration systems',
    'experiential marketing agency',
  ],
  defaultOgImage:
    'https://images.unsplash.com/photo-1475721027889-d74a52b22810?auto=format&fit=crop&w=1200&h=630&q=80',
  email: 'nebuloidtechstudio1@gmail.com',
  phone: '+917303922260',
  address: {
    streetAddress: 'H no. 944, Block - C, Sushant Lok 1',
    addressLocality: 'Gurugram',
    addressRegion: 'Haryana',
    postalCode: '122001',
    addressCountry: 'IN',
  },
  social: {
    instagram: '',
    linkedin: '',
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
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path)
  const ogImage = image ?? siteConfig.defaultOgImage
  const mergedKeywords = [...new Set([...siteConfig.defaultKeywords, ...keywords])]

  return {
    title,
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical: url,
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
          },
        },
  }
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl('/assets/nebuloid-logo-mark.png'),
    description: siteConfig.defaultDescription,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      '@type': 'PostalAddress',
      ...siteConfig.address,
    },
    areaServed: ['IN', 'Worldwide'],
    knowsAbout: [
      'Event Branding',
      'Creative Technology',
      'Interactive Installations',
      'AI Event Experiences',
      'Corporate Events',
    ],
  }
}

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.defaultDescription,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
  }
}

export function getBreadcrumbSchema(
  items: { name: string; path: string }[],
) {
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
    image,
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: 'Worldwide',
  }
}

export function getArticleSchema({
  title,
  description,
  path,
  image,
  datePublished,
  category,
}: {
  title: string
  description: string
  path: string
  image: string
  datePublished: string
  category: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: absoluteUrl(path),
    image,
    datePublished,
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
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
  }
}

export function getFaqSchema(
  faqs: { question: string; answer: string }[],
) {
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

export function parseBlogDate(date: string) {
  const parsed = Date.parse(`${date} 1`)
  return Number.isNaN(parsed) ? new Date().toISOString() : new Date(parsed).toISOString()
}
