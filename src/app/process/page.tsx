import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PageShell } from '@/components/site/page-shell'
import { processSteps } from '@/lib/site-data'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Our Event Experience Process',
  description:
    'Discover how Nebuloid delivers event experiences — Discover, Imagine, Design, Build, Experience, and Measure — from concept to post-event insight.',
  path: '/process',
  keywords: [
    'event design process',
    'creative technology workflow',
    'corporate event planning steps',
  ],
})

export default function ProcessPage() {
  return (
    <PageShell>
      <div className="section-padding pb-32">
        <div className="content-grid">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            Our Process
          </p>
          <h1 className="mt-4 max-w-4xl text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.95] tracking-[-0.03em]">
            From first conversation to final insight — an experience journey.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#F1E9DB]/65">
            Six deliberate phases that keep creative vision, technical execution,
            and measurable outcomes aligned from start to finish.
          </p>

          <div className="mt-16 space-y-0 divide-y divide-white/10 border-y border-white/10">
            {processSteps.map((step, index) => (
              <div key={step.step} className="grid gap-6 py-12 md:grid-cols-12 md:items-start">
                <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#d4af37] md:col-span-2">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h2 className="text-3xl font-semibold tracking-[-0.02em] md:col-span-4">
                  {step.step}
                </h2>
                <p className="text-lg leading-relaxed text-[#F1E9DB]/65 md:col-span-6">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/contact"
            className="group mt-16 inline-flex items-center gap-3 rounded-full border border-[#F1E9DB]/25 px-6 py-4 text-base font-medium transition-all hover:border-[#d4af37]/50 hover:bg-[#F1E9DB]/5"
          >
            Begin Your Project
            <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
