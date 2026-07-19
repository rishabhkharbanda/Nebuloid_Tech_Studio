'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { footerLinks } from '@/lib/site-data'
import { siteConfig } from '@/lib/seo'

const socialLinks = [
  {
    label: 'Instagram',
    href: siteConfig.social.instagram,
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: siteConfig.social.facebook,
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1Z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: siteConfig.social.linkedin,
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M6.5 9.5H3.7V20h2.8V9.5ZM5.1 4a1.65 1.65 0 1 0 0 3.3A1.65 1.65 0 0 0 5.1 4ZM20.3 20h-2.8v-5.4c0-1.5-.5-2.5-1.8-2.5-.9 0-1.5.6-1.7 1.2-.1.2-.1.5-.1.8V20H11V9.5h2.7v1.4c.4-.7 1.3-1.7 3.1-1.7 2.3 0 3.5 1.5 3.5 4.4V20Z" />
      </svg>
    ),
  },
  {
    label: 'X',
    href: siteConfig.social.x,
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M17.6 4H20l-6.3 7.2L21 20h-5.3l-4.2-5.3L6.3 20H4l6.7-7.7L3.4 4H8.8l3.8 4.9L17.6 4Zm-1 14.3h1.5L7.5 5.6H6L16.6 18.3Z" />
      </svg>
    ),
  },
] as const

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative border-t border-[#F1E9DB]/10">
      <div className="content-grid section-padding pb-10 pt-16 md:pb-12 md:pt-20">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <h2 className="text-display-filled text-[clamp(2.8rem,9vw,6rem)] leading-[0.88] tracking-[0.04em]">
              NEBULOID
            </h2>
            <h2 className="text-outline-display text-[clamp(2.8rem,9vw,6rem)] leading-[0.88] tracking-[0.04em]">
              TECH STUDIO
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-[#F1E9DB]/55 md:text-lg">
              Event experience & creative technology — designed, built, and
              delivered as one seamless ecosystem.
            </p>
            <Link
              href="/contact"
              className="group mt-8 inline-flex items-center gap-3 rounded-full border border-[#F1E9DB]/25 px-6 py-3.5 text-sm font-medium text-[#F1E9DB] transition-all duration-300 hover:border-[#d4af37]/50 hover:bg-[#F1E9DB]/5 md:px-8 md:py-4 md:text-base"
            >
              Start a Collaboration
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#F1E9DB]/20 transition-all duration-300 group-hover:border-[#d4af37]/40 group-hover:bg-[#d4af37]/10">
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-6 lg:gap-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d4af37]">
                Navigate
              </p>
              <nav className="mt-6 flex flex-col gap-3">
                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="w-fit text-sm text-[#F1E9DB]/65 transition-colors duration-300 hover:text-[#F1E9DB]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d4af37]">
                Connect
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#F1E9DB]/20 text-[#F1E9DB]/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d4af37]/50 hover:text-[#F1E9DB]"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
              <p className="mt-6 text-sm leading-relaxed text-[#F1E9DB]/45">
                For project inquiries, visit our{' '}
                <Link href="/contact" className="text-[#F1E9DB]/70 underline-offset-4 hover:text-[#d4af37] hover:underline">
                  contact page
                </Link>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#F1E9DB]/40">
            © {new Date().getFullYear()} Nebuloid Tech Studio LLP
          </p>

          <div className="flex flex-wrap gap-6 font-mono text-[11px] uppercase tracking-[0.14em] text-[#F1E9DB]/40">
            <a href="/privacy" className="transition-colors hover:text-[#F1E9DB]">
              Privacy
            </a>
            <a href="/terms" className="transition-colors hover:text-[#F1E9DB]">
              Terms
            </a>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#F1E9DB]/40 transition-colors hover:text-[#F1E9DB] md:text-right"
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </footer>
  )
}
