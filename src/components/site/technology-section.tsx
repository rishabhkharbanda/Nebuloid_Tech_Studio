'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SectionReveal } from '@/components/site/section-reveal'
import { GravityCapsuleField } from '@/components/site/gravity-capsule-field'
import { technologies } from '@/lib/site-data'

type TechnologySectionProps = {
  limit?: number
}

export function TechnologySection({ limit }: TechnologySectionProps) {
  const items = limit ? technologies.slice(0, limit) : technologies
  const capsules = items.map((tech) => ({
    slug: tech.slug,
    label: tech.title,
  }))

  return (
    <section id="technology" className="section-padding border-y border-white/10">
      <div className="content-grid">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <SectionReveal className="lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
              Technology
            </p>
            <h2 className="mt-4 max-w-xl text-[clamp(2rem,4.5vw,4.5rem)] font-bold leading-tight tracking-[-0.03em]">
              The invisible layer that makes every moment feel effortless.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-[#F1E9DB]/65 md:text-lg">
              We engineer the systems behind the experience — kiosks, AI, navigation,
              registration, and live intelligence — so your audience never sees the
              seams.
            </p>
            <Link
              href="/technology"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#F1E9DB]/50 transition-colors hover:text-[#d4af37]"
            >
              Explore all technology
              <ArrowUpRight size={16} />
            </Link>
          </SectionReveal>

          <SectionReveal delay={0.08} className="lg:col-span-7">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[#F1E9DB]/40">
              Move to attract · Hover to group
            </p>
            <GravityCapsuleField items={capsules} hrefPrefix="/technology" />
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}
