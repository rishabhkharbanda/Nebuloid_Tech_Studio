import type { Metadata } from 'next'
import { Bebas_Neue, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { SmoothScrollProvider } from '@/components/site/smooth-scroll-provider'
import { CustomCursor } from '@/components/site/custom-cursor'
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
  metadataBase: new URL('https://nebuloid.tech'),
  title: {
    default: 'Nebuloid Tech Studio LLP | Event Experience & Creative Technology',
    template: '%s | Nebuloid Tech Studio LLP',
  },
  description:
    'Nebuloid Tech Studio designs, builds, and delivers complete event ecosystems — event branding, interactive installations, AI experiences, registration systems, and digital engagement for corporate events.',
  keywords: [
    'Nebuloid Tech Studio LLP',
    'Event Experience Company',
    'Creative Technology',
    'Event Branding',
    'Corporate Events',
    'Interactive Installations',
    'AI Experiences',
    'Registration Systems',
    'Experiential Marketing',
    'Conference Branding',
  ],
  openGraph: {
    title: 'Nebuloid Tech Studio LLP | Event Experience & Creative Technology',
    description:
      'We design, build, and deliver complete event ecosystems — from branding and motion to kiosks, AI, and digital engagement.',
    type: 'website',
    url: 'https://nebuloid.tech',
    siteName: 'Nebuloid Tech Studio LLP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nebuloid Tech Studio LLP',
    description:
      'Event experience & creative technology — designed, built, and delivered as one.',
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
      <body className="bg-[#090909] text-[#F1E9DB] antialiased">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <CustomCursor />
      </body>
    </html>
  )
}
