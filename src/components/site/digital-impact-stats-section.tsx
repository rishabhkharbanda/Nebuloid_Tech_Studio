'use client'

import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { SectionReveal } from '@/components/site/section-reveal'
import { digitalImpactStats, impactOutcomes } from '@/lib/digital-data'
import { cn } from '@/lib/utils'

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let current = 0
    const increment = Math.max(1, Math.ceil(target / 50))
    const interval = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(interval)
      }
      setValue(current)
    }, 24)
    return () => clearInterval(interval)
  }, [isInView, target])

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  )
}

export function DigitalImpactStatsSection({ showViewAll = true }: { showViewAll?: boolean }) {
  const featured = digitalImpactStats.filter((stat) => 'featured' in stat && stat.featured)
  const regular = digitalImpactStats.filter((stat) => !('featured' in stat && stat.featured))

  return (
    <section id="impact" className="section-padding border-y border-white/10">
      <div className="content-grid">
        <SectionReveal>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
                Impact
              </p>
              <h2 className="mt-4 max-w-4xl text-[clamp(2rem,5vw,5rem)] font-bold leading-tight tracking-[-0.03em]">
                Delivering Digital Experiences That Create Impact
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#F1E9DB]/65 md:text-lg">
                Measurable outcomes across visitor engagement, event participation, institutional
                visibility, and memorable brand experiences — built through custom technology.
              </p>
            </div>

            <div className="lg:col-span-4 lg:text-right">
              {showViewAll && (
                <Link
                  href="/digital-experiences"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#F1E9DB]/50 transition-colors hover:text-[#d4af37]"
                >
                  See our work
                  <ArrowUpRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </SectionReveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-12">
          {featured.map((stat, index) => {
            const isText = 'isText' in stat && stat.isText

            return (
              <SectionReveal
                key={stat.id}
                delay={index * 0.06}
                className="sm:col-span-2 xl:col-span-4"
              >
                <motion.article
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.4 }}
                  className="relative flex h-full min-h-[280px] flex-col justify-center overflow-hidden rounded-[1.75rem] border border-[#d4af37]/20 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.12),transparent_55%),rgba(255,255,255,0.03)] p-8 text-center backdrop-blur-xl md:p-10"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d4af37]/80">
                    {stat.id}
                  </p>
                  <p
                    className={cn(
                      'mt-6 font-bold tracking-[-0.04em] text-[#F1E9DB]',
                      isText
                        ? 'text-[clamp(2rem,4vw,3.25rem)] leading-tight'
                        : 'text-[clamp(4.5rem,8vw,6.5rem)] leading-none',
                    )}
                  >
                    {isText ? (
                      <>
                        {stat.value}
                        {stat.suffix}
                      </>
                    ) : (
                      <Counter target={Number(stat.value)} suffix={stat.suffix} />
                    )}
                  </p>
                  <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#d4af37]">
                    {stat.label}
                  </p>
                  <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-[#F1E9DB]/60 md:text-base">
                    {stat.description}
                  </p>
                </motion.article>
              </SectionReveal>
            )
          })}

          {regular.map((stat, index) => {
            const isText = 'isText' in stat && stat.isText

            return (
              <SectionReveal
                key={stat.id}
                delay={0.08 + index * 0.05}
                className="xl:col-span-2"
              >
                <motion.article
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.4 }}
                  className="flex h-full min-h-[220px] flex-col justify-center rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 text-center backdrop-blur-xl transition-colors hover:border-[#d4af37]/25 md:p-7"
                >
                  <p
                    className={cn(
                      'font-bold tracking-[-0.03em] text-[#F1E9DB]',
                      isText
                        ? 'text-[clamp(1.35rem,2vw,1.75rem)] leading-tight'
                        : 'text-4xl md:text-5xl',
                    )}
                  >
                    {isText ? (
                      <>
                        {stat.value}
                        {stat.suffix}
                      </>
                    ) : (
                      <Counter target={Number(stat.value)} suffix={stat.suffix} />
                    )}
                  </p>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/55">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[#F1E9DB]/55">
                    {stat.description}
                  </p>
                </motion.article>
              </SectionReveal>
            )
          })}
        </div>

        <SectionReveal delay={0.15} className="mt-10">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl md:p-8">
            <div className="mb-5 flex items-center justify-center gap-2 md:justify-start">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/25 bg-[#d4af37]/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#d4af37]">
                <TrendingUp size={14} />
                Outcomes we deliver
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {impactOutcomes.map((outcome, index) => (
                <motion.span
                  key={outcome}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-[#F1E9DB]/65 transition-colors hover:border-[#d4af37]/30 hover:text-[#F1E9DB]/85"
                >
                  {outcome}
                </motion.span>
              ))}
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
