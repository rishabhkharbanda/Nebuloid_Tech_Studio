import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import '@/app/globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'Nebuloid Admin',
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${spaceGrotesk.variable} min-h-screen bg-[#f4f5f7] font-sans text-[#111827] antialiased`}>
      {children}
    </div>
  )
}
