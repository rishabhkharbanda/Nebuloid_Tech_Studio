'use client'

import { motion } from 'framer-motion'
import { SectionReveal } from '@/components/site/section-reveal'

const steps = ['Discover', 'Design', 'Develop', 'Launch', 'Grow']

export function ProcessSection() {
  return (
    <section className="section-padding">
      <div className="content-grid">
        <SectionReveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            Process
          </p>
          <h2 className="mt-4 text-[clamp(2rem,4.5vw,4.8rem)] font-bold tracking-[-0.03em]">
            A focused process that keeps momentum high and outcomes measurable.
          </h2>
        </SectionReveal>
        <div className="mt-14 overflow-x-auto pb-3">
          <div className="min-w-[760px]">
            <div className="relative grid grid-cols-5 gap-5">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1 }}
                className="absolute top-[1.05rem] col-span-5 h-px origin-left bg-gradient-to-r from-[#d4af37]/20 via-[#d4af37] to-[#d4af37]/20"
              />
              {steps.map((step, index) => (
                <SectionReveal key={step} delay={index * 0.08}>
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full border border-[#d4af37] bg-[#090909]" />
                    <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-[#F1E9DB]/60">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold">{step}</h3>
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
