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
    default: 'Nebuloid Tech Studio LLP | Your Vision. Our Mission.',
    template: '%s | Nebuloid Tech Studio LLP',
  },
  description:
    'Nebuloid Tech Studio LLP is a premium digital agency crafting websites, software, social media systems, event solutions, and high-end creative experiences.',
  keywords: [
    'Nebuloid Tech Studio LLP',
    'Creative Agency',
    'Website Development',
    'Software Development',
    'Social Media Management',
    'Event Solutions',
  ],
  openGraph: {
    title: 'Nebuloid Tech Studio LLP',
    description:
      'We build premium digital experiences that help brands launch, grow, and dominate online.',
    type: 'website',
    url: 'https://nebuloid.tech',
    siteName: 'Nebuloid Tech Studio LLP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nebuloid Tech Studio LLP',
    description:
      'Your Vision. Our Mission. Handcrafted websites and digital experiences.',
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
