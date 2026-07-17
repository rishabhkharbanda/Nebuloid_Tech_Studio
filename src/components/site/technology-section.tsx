'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Cpu, Radar, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SectionReveal } from '@/components/site/section-reveal'
import { technologies, technologyCategories } from '@/lib/site-data'
import { cn } from '@/lib/utils'

type TechnologySectionProps = {
  limit?: number
  showViewAll?: boolean
}

const pillars = [
  { icon: Sparkles, label: 'AI-Ready Systems' },
  { icon: Radar, label: 'Live Environment Proven' },
  { icon: Cpu, label: 'End-to-End Engineering' },
]

const categoryAccent: Record<string, string> = {
  Interactive: 'border-[#6c9eff]/30 text-[#6c9eff]',
  AI: 'border-[#d4af37]/30 text-[#d4af37]',
  Digital: 'border-[#9b8cff]/30 text-[#9b8cff]',
  Analytics: 'border-[#5fd4a4]/30 text-[#5fd4a4]',
}

export function TechnologySection({ limit, showViewAll = true }: TechnologySectionProps) {
  const baseItems = useMemo(
    () => (limit ? technologies.slice(0, limit) : [...technologies]),
    [limit],
  )
  const [activeCategory, setActiveCategory] = useState<(typeof technologyCategories)[number]>('All')

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return baseItems
    return baseItems.filter((tech) => tech.category === activeCategory)
  }, [activeCategory, baseItems])

  return (
    <section id="technology" className="section-padding border-y border-white/10">
      <div className="content-grid">
        <SectionReveal>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-3xl">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
                Technology
              </p>
              <h2 className="mt-4 text-[clamp(2rem,5vw,5rem)] font-bold leading-tight tracking-[-0.03em]">
                The invisible layer that makes every moment feel effortless.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#F1E9DB]/65 md:text-lg">
                Kiosks, AI activations, navigation, registration, and live intelligence —
                engineered as one cohesive system so audiences feel magic, not machinery.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {pillars.map((pillar) => (
                <div
                  key={pillar.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#F1E9DB]/55"
                >
                  <pillar.icon size={14} className="text-[#d4af37]" />
                  {pillar.label}
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.06} className="mt-10 flex flex-wrap gap-2">
          {technologyCategories.map((category) => {
            const isActive = activeCategory === category
            const count =
              category === 'All'
                ? baseItems.length
                : baseItems.filter((tech) => tech.category === category).length

            if (count === 0) return null

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors',
                  isActive
                    ? 'border-[#d4af37]/45 bg-[#d4af37]/10 text-[#F1E9DB]'
                    : 'border-white/10 bg-white/[0.02] text-[#F1E9DB]/50',
                )}
              >
                {category}
                <span className="ml-2 text-[#F1E9DB]/35">{count}</span>
              </button>
            )
          })}
        </SectionReveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((tech, index) => (
            <SectionReveal key={tech.slug} delay={index * 0.05}>
              <Link href={`/technology/${tech.slug}`} className="group block h-full">
                <motion.article
                  layout
                  className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-colors duration-300 hover:border-[#d4af37]/25"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={tech.image}
                      alt={tech.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <div className="absolute left-5 top-5">
                      <span
                        className={cn(
                          'rounded-full border bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] backdrop-blur-md',
                          categoryAccent[tech.category],
                        )}
                      >
                        {tech.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#F1E9DB] transition-colors group-hover:text-[#d4af37]">
                      {tech.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[#F1E9DB]/60">
                      {tech.tagline}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#F1E9DB]/45 transition-all group-hover:gap-3 group-hover:text-[#d4af37]">
                      Explore technology
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                </motion.article>
              </Link>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal delay={0.1} className="mt-10">
          {showViewAll && (
            <Link
              href="/technology"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#F1E9DB]/45 transition-colors hover:text-[#d4af37]"
            >
              View full technology stack
              <ArrowUpRight size={14} />
            </Link>
          )}
        </SectionReveal>
      </div>
    </section>
  )
}
