'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Cpu, Radar, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SectionReveal } from '@/components/site/section-reveal'
import { GravityCapsuleField } from '@/components/site/gravity-capsule-field'
import { technologyDetails } from '@/lib/detail-content'
import { technologies, technologyCategories } from '@/lib/site-data'
import { cn } from '@/lib/utils'

type TechnologySectionProps = {
  limit?: number
}

const pillars = [
  { icon: Sparkles, label: 'AI-Ready Systems' },
  { icon: Radar, label: 'Live Environment Proven' },
  { icon: Cpu, label: 'End-to-End Engineering' },
]

export function TechnologySection({ limit }: TechnologySectionProps) {
  const baseItems = useMemo(
    () => (limit ? technologies.slice(0, limit) : [...technologies]),
    [limit],
  )
  const [activeCategory, setActiveCategory] = useState<(typeof technologyCategories)[number]>('All')
  const [activeSlug, setActiveSlug] = useState<string | null>(baseItems[0]?.slug ?? null)

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return baseItems
    return baseItems.filter((tech) => tech.category === activeCategory)
  }, [activeCategory, baseItems])

  const activeTech = useMemo(() => {
    if (filteredItems.length === 0) return null
    return filteredItems.find((tech) => tech.slug === activeSlug) ?? filteredItems[0]
  }, [filteredItems, activeSlug])

  const handleCategoryChange = (category: (typeof technologyCategories)[number]) => {
    setActiveCategory(category)
    const nextItems =
      category === 'All' ? baseItems : baseItems.filter((tech) => tech.category === category)
    setActiveSlug(nextItems[0]?.slug ?? null)
  }
  const activeDetails = activeTech ? technologyDetails[activeTech.slug] : null

  const capsules = filteredItems.map((tech) => ({
    slug: tech.slug,
    label: tech.title,
    category: tech.category,
  }))

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
                onClick={() => handleCategoryChange(category)}
                className={cn(
                  'relative rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors',
                  isActive
                    ? 'border-[#d4af37]/45 bg-[#d4af37]/10 text-[#F1E9DB]'
                    : 'border-white/10 bg-white/[0.02] text-[#F1E9DB]/50 hover:border-white/20 hover:text-[#F1E9DB]/75',
                )}
              >
                {category}
                <span className="ml-2 text-[#F1E9DB]/35">{count}</span>
                {isActive && (
                  <motion.span
                    layoutId="tech-category-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-[#d4af37]/10"
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  />
                )}
              </button>
            )
          })}
        </SectionReveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-start">
          <SectionReveal delay={0.08} className="lg:col-span-7">
            <GravityCapsuleField
              key={activeCategory}
              items={capsules}
              hrefPrefix="/technology"
              activeSlug={activeTech?.slug ?? null}
              onActiveChange={setActiveSlug}
            />
          </SectionReveal>

          <SectionReveal delay={0.12} className="lg:col-span-5">
            <div className="sticky top-32">
              <AnimatePresence mode="wait">
                {activeTech && (
                  <motion.article
                    key={activeTech.slug}
                    initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
                    transition={{ duration: 0.45, ease: [0.2, 0.65, 0.3, 0.9] }}
                    className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={activeTech.image}
                        alt={activeTech.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-6">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d4af37]">
                          {activeTech.category}
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-[#F1E9DB]">
                          {activeTech.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-6 md:p-8">
                      <p className="leading-relaxed text-[#F1E9DB]/70">
                        {activeDetails?.intro ?? activeTech.tagline}
                      </p>

                      {activeDetails?.highlights && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {activeDetails.highlights.slice(0, 4).map((highlight) => (
                            <span
                              key={highlight}
                              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#F1E9DB]/55"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      )}

                      <Link
                        href={`/technology/${activeTech.slug}`}
                        className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#F1E9DB]/55 transition-all hover:gap-3 hover:text-[#d4af37]"
                      >
                        Explore {activeTech.title}
                        <ArrowUpRight size={16} />
                      </Link>
                    </div>
                  </motion.article>
                )}
              </AnimatePresence>

              <Link
                href="/technology"
                className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#F1E9DB]/45 transition-colors hover:text-[#d4af37]"
              >
                View full technology stack
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}
