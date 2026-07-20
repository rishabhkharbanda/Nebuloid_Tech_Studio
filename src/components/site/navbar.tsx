'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { MagneticButton } from '@/components/site/magnetic-button'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'Digital', href: '/digital-experiences' },
  { label: 'Insights', href: '/insights' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

function AnimatedLabel({ text }: { text: string }) {
  return (
    <span className="group relative block overflow-hidden">
      <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
        {text}
      </span>
      <span className="absolute left-0 top-full inline-block transition-transform duration-300 group-hover:-translate-y-full">
        {text}
      </span>
    </span>
  )
}

export function Navbar() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileOpen])

  return (
    <header
      data-scrolled={scrolled}
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b border-white/10 transition-all duration-500',
        scrolled
          ? 'bg-black/40 backdrop-blur-xl'
          : 'bg-gradient-to-r from-black/70 via-black/30 to-[#8A6A0A]/30',
      )}
    >
      <div className="content-grid px-6 md:px-10 lg:px-16">
        <div className="flex h-16 items-center justify-between md:h-20">
          <Link href="/" className="inline-flex shrink-0 items-center">
            <Image
              src="/assets/nebuloid-logo-mark.png"
              alt="Nebuloid Tech Studio"
              width={56}
              height={56}
              className="h-10 w-10 shrink-0 object-contain md:h-12 md:w-12"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-sm font-medium text-[#F1E9DB]"
              >
                <AnimatedLabel text={link.label} />
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#d4af37] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <MagneticButton
            size="default"
            className="hidden lg:inline-flex"
            onClick={() => router.push('/contact')}
          >
            Get In Touch <ArrowUpRight size={16} />
          </MagneticButton>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 lg:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle menu"
          >
            <span className="font-mono text-xs">{mobileOpen ? 'CLOSE' : 'MENU'}</span>
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div
          id="mobile-nav"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-black/95 px-6 py-6 backdrop-blur-xl md:max-h-[calc(100dvh-5rem)] md:px-10 lg:hidden"
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-2 py-3 text-lg font-semibold text-[#F1E9DB] transition-colors hover:bg-white/[0.04] hover:text-[#d4af37]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#F1E9DB] px-6 py-3.5 text-sm font-semibold text-[#090909]"
          >
            Get In Touch
            <ArrowUpRight size={16} />
          </Link>
        </div>
      )}
    </header>
  )
}
