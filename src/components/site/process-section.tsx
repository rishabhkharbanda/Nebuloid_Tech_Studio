'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { SectionReveal } from '@/components/site/section-reveal'
import { processSteps } from '@/lib/site-data'

export function ProcessSection() {
  return (
    <section id="process" className="section-padding">
      <div className="content-grid">
        <SectionReveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            Our Process
          </p>
          <h2 className="mt-4 max-w-4xl text-[clamp(2rem,4.5vw,4.8rem)] font-bold tracking-[-0.03em]">
            From first conversation to final insight — an experience journey.
          </h2>
          <Link
            href="/process"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#F1E9DB]/50 transition-colors hover:text-[#d4af37]"
          >
            View full process
            <ArrowUpRight size={16} />
          </Link>
        </SectionReveal>
        <div className="mt-14 overflow-x-auto pb-3">
          <div className="min-w-[920px]">
            <div className="relative grid grid-cols-6 gap-5">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1 }}
                className="absolute top-[1.05rem] col-span-6 h-px origin-left bg-gradient-to-r from-[#d4af37]/20 via-[#d4af37] to-[#d4af37]/20"
              />
              {processSteps.map((step, index) => (
                <SectionReveal key={step.step} delay={index * 0.08}>
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full border border-[#d4af37] bg-[#090909]" />
                    <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-[#F1E9DB]/60">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold md:text-2xl">{step.step}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#F1E9DB]/55">
                      {step.description}
                    </p>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
