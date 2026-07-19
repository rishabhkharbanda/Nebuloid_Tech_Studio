import type { Metadata } from 'next'
import { Bebas_Neue, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { JsonLd } from '@/components/site/json-ld'
import { SmoothScrollProvider } from '@/components/site/smooth-scroll-provider'
import { CustomCursor } from '@/components/site/custom-cursor'
import { SecretDaylightToggle } from '@/components/site/secret-daylight-toggle'
import {
  getOrganizationSchema,
  getWebsiteSchema,
  siteConfig,
} from '@/lib/seo'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
})

const bebasNeue = Bebas_Neue({
  variable: '--font-bebas-neue',
  weight: '400',
  subsets: ['latin'],
})

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
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
    canonical: siteConfig.url,
  },
  openGraph: {
    title: `${siteConfig.shortName} | Event Experience & Creative Technology`,
    description: siteConfig.defaultDescription,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: 'website',
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.shortName,
    description: siteConfig.defaultDescription,
    images: [siteConfig.defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/assets/nebuloid-logo-mark.png',
    apple: '/assets/nebuloid-logo-mark.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${bebasNeue.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <JsonLd data={[getOrganizationSchema(), getWebsiteSchema()]} />
      </head>
      <body className="bg-[#090909] text-[#F1E9DB] antialiased">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <SecretDaylightToggle />
        <CustomCursor />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
