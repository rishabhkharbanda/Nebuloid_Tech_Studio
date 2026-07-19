import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { AboutProcessSection } from '@/components/site/about-process-section'
import { DigitalImpactStatsSection } from '@/components/site/digital-impact-stats-section'
import { PageShell } from '@/components/site/page-shell'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'About Nebuloid Tech Studio',
  description:
    'Learn about Nebuloid Tech Studio — an event experience and creative technology company designing complete event ecosystems for corporate brands in India.',
  path: '/about',
  keywords: [
    'about Nebuloid Tech Studio',
    'event experience company India',
    'creative technology studio Gurugram',
  ],
})

export default function AboutPage() {
  return (
    <PageShell>
      <div className="section-padding pb-20 md:pb-28">
        <div className="content-grid">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            Why Nebuloid
          </p>
          <h1 className="mt-5 max-w-4xl text-[clamp(2.5rem,6.5vw,5.5rem)] font-bold leading-[0.92] tracking-[-0.04em]">
            We don&apos;t plan events.
            <br />
            <span className="text-gradient-gold">We create experiences.</span>
          </h1>

          <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="space-y-6 text-lg leading-relaxed text-[#F1E9DB]/70 lg:col-span-7">
              <p>
                Nebuloid Tech Studio exists because events deserve more than
                logistics and more than software. We are a creative technology
                partner — designing complete event ecosystems where branding,
                motion, interactive installations, and digital systems work as
                one.
              </p>
              <p>
                Every touchpoint has intent. Every interaction has purpose.
                Every experience is built to be remembered.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-8 md:p-10 lg:col-span-5">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
                Our Approach
              </p>
              <p className="mt-5 text-base leading-relaxed text-[#F1E9DB]/70 md:text-lg">
                We combine event branding, creative production, and interactive
                technology into one seamless partner — so you work with one team,
                not five vendors.
              </p>
            </div>
          </div>

          <AboutProcessSection />
        </div>
      </div>

      <DigitalImpactStatsSection showViewAll={false} />

      <div className="section-padding pb-28 md:pb-32">
        <div className="content-grid">
          <div className="flex flex-col gap-4 border-t border-white/10 pt-12 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
                Next Step
              </p>
              <p className="mt-3 max-w-xl text-lg text-[#F1E9DB]/65">
                Ready to shape your next event ecosystem with Nebuloid?
              </p>
            </div>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-full border border-[#F1E9DB]/25 px-6 py-4 text-base font-medium transition-all hover:border-[#d4af37]/50 hover:bg-[#F1E9DB]/5"
            >
              Start a Collaboration
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
