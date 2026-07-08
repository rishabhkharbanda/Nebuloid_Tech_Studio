'use client'

import Link from 'next/link'
import { ArrowUpRight, AtSign, Globe, Send } from 'lucide-react'
import { footerLinks } from '@/lib/site-data'

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
              <div className="mt-6 flex items-center gap-3">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#F1E9DB]/20 text-[#F1E9DB]/70 transition-colors hover:border-[#F1E9DB]/50 hover:text-[#F1E9DB]"
                >
                  <AtSign size={16} />
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#F1E9DB]/20 text-[#F1E9DB]/70 transition-colors hover:border-[#F1E9DB]/50 hover:text-[#F1E9DB]"
                >
                  <Send size={16} />
                </a>
                <a
                  href="#"
                  aria-label="Website"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#F1E9DB]/20 text-[#F1E9DB]/70 transition-colors hover:border-[#F1E9DB]/50 hover:text-[#F1E9DB]"
                >
                  <Globe size={16} />
                </a>
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
            <a href="#" className="transition-colors hover:text-[#F1E9DB]">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-[#F1E9DB]">
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
