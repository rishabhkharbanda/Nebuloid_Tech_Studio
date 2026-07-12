'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { SectionReveal } from '@/components/site/section-reveal'
import { industryDetails } from '@/lib/detail-content'
import { industries } from '@/lib/site-data'
import { cn } from '@/lib/utils'

type IndustriesSectionProps = {
  limit?: number
}

export function IndustriesSection({ limit }: IndustriesSectionProps) {
  const items = limit ? industries.slice(0, limit) : industries
  const useBento = limit === 3

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
            From corporate summits and medical conferences to government ceremonies,
            exhibitions, and tourism destinations — we tailor digital experiences
            to the audience, protocol, and pace of your sector.
          </p>
          <Link
            href="/industries"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#F1E9DB]/50 transition-colors hover:text-[#d4af37]"
          >
            View all industries
            <ArrowUpRight size={16} />
          </Link>
        </SectionReveal>

        <div
          className={cn(
            'mt-14',
            useBento
              ? 'grid gap-5 lg:grid-cols-12 lg:grid-rows-2'
              : 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
          )}
        >
          {items.map((industry, index) => {
            const highlights = industryDetails[industry.slug]?.highlights.slice(0, 3) ?? []
            const isFeatured = useBento && index === 0

            return (
              <SectionReveal
                key={industry.slug}
                delay={index * 0.06}
                className={cn(
                  useBento && index === 0 && 'lg:col-span-7 lg:row-span-2',
                  useBento && index === 1 && 'lg:col-span-5',
                  useBento && index === 2 && 'lg:col-span-5',
                )}
              >
                <Link href={`/industries/${industry.slug}`} className="group block h-full">
                  <motion.article
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.45, ease: [0.2, 0.65, 0.3, 0.9] }}
                    className={cn(
                      'relative h-full min-h-[280px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0c0c0c]',
                      isFeatured && 'min-h-[360px] lg:min-h-[520px]',
                    )}
                  >
                    <Image
                      src={industry.image}
                      alt={industry.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes={
                        isFeatured
                          ? '(max-width: 1024px) 100vw, 55vw'
                          : '(max-width: 768px) 100vw, 33vw'
                      }
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10 transition-opacity duration-500 group-hover:from-black/95" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_45%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="absolute inset-0 flex flex-col justify-between p-7 md:p-8">
                      <div className="flex items-start justify-between gap-4">
                        <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#d4af37]/90 backdrop-blur-md">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/30 text-[#F1E9DB]/50 backdrop-blur-md transition-all duration-300 group-hover:border-[#d4af37]/45 group-hover:text-[#d4af37]">
                          <ArrowUpRight size={16} />
                        </span>
                      </div>

                      <div>
                        <h3
                          className={cn(
                            'font-semibold tracking-[-0.02em] text-[#F1E9DB] transition-colors group-hover:text-[#d4af37]',
                            isFeatured
                              ? 'text-[clamp(1.75rem,3vw,2.75rem)] leading-tight'
                              : 'text-2xl md:text-[1.75rem]',
                          )}
                        >
                          {industry.title}
                        </h3>
                        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#F1E9DB]/70 md:text-base">
                          {industry.description}
                        </p>

                        {highlights.length > 0 && (
                          <div className="mt-5 flex flex-wrap gap-2">
                            {highlights.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#F1E9DB]/55 backdrop-blur-md transition-colors group-hover:border-[#d4af37]/25 group-hover:text-[#F1E9DB]/80"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.article>
                </Link>
              </SectionReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
