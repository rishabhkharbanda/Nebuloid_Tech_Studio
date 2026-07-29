'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SectionReveal } from '@/components/site/section-reveal'
import { StretchLink } from '@/components/site/stretch-link'
import { industryDetails } from '@/lib/detail-content'
import { industries } from '@/lib/site-data'

type IndustriesSectionProps = {
  limit?: number
  showViewAll?: boolean
}

export function IndustriesSection({ limit, showViewAll = true }: IndustriesSectionProps) {
  const items = limit ? industries.slice(0, limit) : industries

  return (
    <section id="industries" className="section-padding">
      <div className="content-grid">
        <SectionReveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            Industries We Serve
          </p>
          <h2 className="mt-4 max-w-4xl text-[clamp(2rem,5vw,5rem)] font-bold leading-tight tracking-[-0.03em]">
            Every industry has its own rhythm. We design experiences that match
            yours.
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#F1E9DB]/65 md:text-lg">
            Entertainment, textile, tourism, tech, agriculture, religious, and more —
            we tailor digital experiences to the audience, protocol, and pace of your sector.
          </p>
          {showViewAll && (
            <Link
              href="/industries"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#F1E9DB]/50 transition-colors hover:text-[#d4af37]"
            >
              View all industries
              <ArrowUpRight size={16} />
            </Link>
          )}
        </SectionReveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((industry, index) => {
            const highlights = industryDetails[industry.slug]?.highlights.slice(0, 3) ?? []

            return (
              <SectionReveal key={industry.slug} delay={index * 0.06}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0c0c0c] transition-colors duration-300 hover:border-[#d4af37]/35">
                  <StretchLink
                    href={`/industries/${industry.slug}`}
                    label={`Explore ${industry.title} industry work`}
                  />
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10">
                    <Image
                      src={industry.image}
                      alt={`${industry.title} industry experiences by Nebuloid Tech Studio`}
                      fill
                      className="object-cover grayscale transition-[transform,filter] duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      quality={70}
                      loading="lazy"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d4af37]/90">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[#F1E9DB]/40 transition-all duration-300 group-hover:border-[#d4af37]/45 group-hover:text-[#d4af37]">
                        <ArrowUpRight size={15} />
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-[#F1E9DB] transition-colors group-hover:text-[#d4af37] md:text-2xl">
                      {industry.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[#F1E9DB]/65 md:text-base">
                      {industry.description}
                    </p>

                    {highlights.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {highlights.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#F1E9DB]/55 transition-colors group-hover:border-[#d4af37]/25 group-hover:text-[#F1E9DB]/80"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </SectionReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
