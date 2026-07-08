'use client'

import { AtSign, Globe, Send } from 'lucide-react'

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative border-t border-[#F1E9DB]/10 px-6 py-16 md:px-10 md:py-20 lg:px-16">
      <div className="content-grid space-y-14 md:space-y-20">
        {/* Top row — CTA + socials */}
        <div className="grid items-center gap-10 md:grid-cols-[1fr_auto_1fr]">
          <p className="font-mono text-xs text-[#F1E9DB]/65 md:text-sm">
            — Ready to design something unforgettable?
          </p>

          <a
            href="mailto:nebuloidtechstudio1@gmail.com"
            className="inline-flex w-full items-center justify-center rounded-full border border-[#F1E9DB]/35 px-6 py-4 text-center text-base font-medium text-[#F1E9DB] transition-all duration-300 hover:border-[#F1E9DB] hover:bg-[#F1E9DB]/5 md:w-auto md:px-10 md:py-5 md:text-xl"
          >
            nebuloidtechstudio1@gmail.com
          </a>

          <div className="flex items-center gap-3 md:justify-end">
            <a
              href="#"
              aria-label="Instagram"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#F1E9DB]/25 text-[#F1E9DB]/80 transition-colors hover:border-[#F1E9DB]/60 hover:text-[#F1E9DB]"
            >
              <AtSign size={17} />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#F1E9DB]/25 text-[#F1E9DB]/80 transition-colors hover:border-[#F1E9DB]/60 hover:text-[#F1E9DB]"
            >
              <Send size={17} />
            </a>
            <a
              href="#"
              aria-label="Website"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#F1E9DB]/25 text-[#F1E9DB]/80 transition-colors hover:border-[#F1E9DB]/60 hover:text-[#F1E9DB]"
            >
              <Globe size={17} />
            </a>
          </div>
        </div>

        {/* Middle row — brand statement */}
        <div className="select-none space-y-4">
          <h2 className="text-display-filled text-[clamp(3.2rem,13vw,12rem)] leading-[0.82] tracking-[0.03em]">
            NEBULOID
          </h2>
          <h2 className="text-display-filled text-[clamp(3.2rem,13vw,12rem)] leading-[0.82] tracking-[0.03em]">
            TECH STUDIO
          </h2>
          <p className="max-w-xl font-mono text-xs uppercase tracking-[0.2em] text-[#F1E9DB]/45 md:text-sm">
            Event experience & creative technology — designed, built, and delivered
            as one.
          </p>
        </div>

        {/* Bottom row — utility links */}
        <div className="grid gap-8 md:grid-cols-[1fr_auto_1fr] md:items-end">
          <div className="flex flex-wrap gap-6 font-mono text-xs text-[#F1E9DB]/55">
            <a href="#" className="transition-colors hover:text-[#F1E9DB]">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-[#F1E9DB]">
              Terms
            </a>
          </div>

          <div className="space-y-2 text-center font-mono text-xs text-[#F1E9DB]/55">
            <p>© {new Date().getFullYear()} Nebuloid Tech Studio LLP.</p>
            <a
              href="tel:+917303922260"
              className="inline-block transition-colors hover:text-[#F1E9DB]"
            >
              +91 7303922260
            </a>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="font-mono text-xs text-[#F1E9DB]/55 transition-colors hover:text-[#F1E9DB] md:text-right"
          >
            Scroll Up ↑
          </button>
        </div>
      </div>
    </footer>
  )
}
