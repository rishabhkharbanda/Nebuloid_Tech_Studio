import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Bebas_Neue, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { AnalyticsRouteListener } from '@/components/site/analytics-route-listener'
import { AnalyticsTags, GoogleAnalyticsTag, GtmNoscript, MetaPixelHead } from '@/components/site/analytics-tags'
import { JsonLd } from '@/components/site/json-ld'
import { SmoothScrollProvider } from '@/components/site/smooth-scroll-provider'
import { DeferredCustomCursor } from '@/components/site/deferred-custom-cursor'
import { BackToTopButton } from '@/components/site/back-to-top-button'
import { SecretDaylightToggle } from '@/components/site/secret-daylight-toggle'
import { themeInitScript } from '@/lib/theme'
import {
  absoluteUrl,
  getLocalBusinessSchema,
  getOrganizationSchema,
  getWebsiteSchema,
  homepageUrl,
  siteConfig,
} from '@/lib/seo'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: true,
})

const bebasNeue = Bebas_Neue({
  variable: '--font-bebas-neue',
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: true,
})

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.shortName} | Event Experience & Creative Technology`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.defaultDescription,
  keywords: [...siteConfig.defaultKeywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: 'Event Experience & Creative Technology',
  alternates: {
    canonical: homepageUrl(),
    types: {
      'application/rss+xml': absoluteUrl('/feed.xml'),
    },
  },
  openGraph: {
    title: `${siteConfig.shortName} | Event Experience & Creative Technology`,
    description: siteConfig.defaultDescription,
    url: homepageUrl(),
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: 'website',
    images: [
      {
        url: absoluteUrl(siteConfig.defaultOgImage),
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — interactive visitor experiences and event technology`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.shortName,
    description: siteConfig.defaultDescription,
    images: [absoluteUrl(siteConfig.defaultOgImage)],
  },
  robots: {
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
  icons: {
    icon: [
      { url: '/assets/nebuloid-logo-mark-day.png', type: 'image/png' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', type: 'image/png' }],
  },
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? {
          other: {
            'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
          },
        }
      : {}),
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en-IN"
      className={`day-theme ${spaceGrotesk.variable} ${bebasNeue.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <MetaPixelHead />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <JsonLd
          data={[getOrganizationSchema(), getWebsiteSchema(), getLocalBusinessSchema()]}
        />
      </head>
      <body className="bg-[#090909] text-[#F1E9DB] antialiased">
        <GoogleAnalyticsTag />
        <GtmNoscript />
        <AnalyticsTags />
        <Suspense fallback={null}>
          <AnalyticsRouteListener />
        </Suspense>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <BackToTopButton />
        <SecretDaylightToggle />
        <DeferredCustomCursor />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
