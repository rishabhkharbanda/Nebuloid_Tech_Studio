'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { SectionReveal } from '@/components/site/section-reveal'
import { processSteps } from '@/lib/site-data'
import { cn } from '@/lib/utils'

export function AboutProcessSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeStep = processSteps[activeIndex]

  return (
    <div className="mt-20 border-t border-white/10 pt-16">
      <SectionReveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
              Our Process
            </p>
            <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-tight tracking-[-0.03em]">
              From first conversation to final insight
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#F1E9DB]/65 md:text-lg">
              Six deliberate phases that keep creative vision, technical execution, and
              measurable outcomes aligned from start to finish.
            </p>
          </div>
          <Link
            href="/process"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#F1E9DB]/50 transition-colors hover:text-[#d4af37]"
          >
            View full process
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </SectionReveal>

      {/* Mobile / tablet: vertical step list */}
      <SectionReveal delay={0.08} className="mt-12 lg:hidden">
        <div className="space-y-3">
          {processSteps.map((step, index) => {
            const isActive = activeIndex === index

            return (
              <button
                key={step.step}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors',
                  isActive
                    ? 'border-[#d4af37]/35 bg-[#d4af37]/[0.06]'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20',
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-mono text-xs',
                    isActive
                      ? 'border-[#d4af37] bg-[#d4af37]/15 text-[#d4af37]'
                      : 'border-white/20 text-[#F1E9DB]/50',
                  )}
                >
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="min-w-0 flex-1">
                  <h3
                    className={cn(
                      'text-base font-semibold transition-colors',
                      isActive ? 'text-[#F1E9DB]' : 'text-[#F1E9DB]/70',
                    )}
                  >
                    {step.step}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-[#F1E9DB]/50">
                    {step.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </SectionReveal>

      {/* Desktop: horizontal timeline */}
      <SectionReveal delay={0.08} className="mt-12 hidden lg:block">
        <div className="relative grid grid-cols-6 gap-4">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1 }}
            className="absolute top-4 col-span-6 h-px origin-left bg-gradient-to-r from-[#d4af37]/15 via-[#d4af37]/70 to-[#d4af37]/15"
          />

          {processSteps.map((step, index) => {
            const isActive = activeIndex === index

            return (
              <button
                key={step.step}
                type="button"
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setActiveIndex(index)}
                className="group relative text-left"
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.15 : 1,
                    boxShadow: isActive
                      ? '0 0 24px rgba(212,175,55,0.35)'
                      : '0 0 0px rgba(212,175,55,0)',
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className={cn(
                    'h-8 w-8 rounded-full border bg-[#090909] transition-colors',
                    isActive
                      ? 'border-[#d4af37] bg-[#d4af37]/15'
                      : 'border-white/20 group-hover:border-[#d4af37]/50',
                  )}
                />
                <p
                  className={cn(
                    'mt-6 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors',
                    isActive ? 'text-[#d4af37]' : 'text-[#F1E9DB]/40 group-hover:text-[#F1E9DB]/65',
                  )}
                >
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3
                  className={cn(
                    'mt-2 text-lg font-semibold transition-colors md:text-xl',
                    isActive ? 'text-[#F1E9DB]' : 'text-[#F1E9DB]/65 group-hover:text-[#F1E9DB]',
                  )}
                >
                  {step.step}
                </h3>
              </button>
            )
          })}
        </div>
      </SectionReveal>

      <SectionReveal delay={0.12} className="mt-10">
        <AnimatePresence mode="wait">
          <motion.article
            key={activeStep.step}
            initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
            transition={{ duration: 0.45, ease: [0.2, 0.65, 0.3, 0.9] }}
            className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.08),transparent_45%),rgba(255,255,255,0.03)] backdrop-blur-xl"
          >
            <div className="grid gap-8 p-8 md:grid-cols-12 md:items-start md:p-10">
              <div className="md:col-span-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d4af37]">
                  Phase {String(activeIndex + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.03em] text-[#F1E9DB]">
                  {activeStep.step}
                </h3>
                <p className="mt-4 text-lg leading-relaxed text-[#F1E9DB]/70">
                  {activeStep.description}
                </p>
              </div>

              <div className="md:col-span-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#F1E9DB]/45">
                  What happens in this phase
                </p>
                <p className="mt-4 text-base leading-relaxed text-[#F1E9DB]/65 md:text-lg">
                  {activeStep.detail}
                </p>

                <div className="mt-8">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d4af37]/80">
                    Key outputs
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {activeStep.outputs.map((output) => (
                      <span
                        key={output}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#F1E9DB]/60"
                      >
                        {output}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </SectionReveal>

      <div className="mt-6 hidden flex-wrap gap-2 lg:flex">
        {processSteps.map((step, index) => (
          <button
            key={`pill-${step.step}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={cn(
              'rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors',
              activeIndex === index
                ? 'border-[#d4af37]/45 bg-[#d4af37]/10 text-[#F1E9DB]'
                : 'border-white/10 bg-white/[0.02] text-[#F1E9DB]/45 hover:border-white/20 hover:text-[#F1E9DB]/70',
            )}
          >
            {step.step}
          </button>
        ))}
      </div>
    </div>
  )
}
