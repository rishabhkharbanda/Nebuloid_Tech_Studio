'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { SectionReveal } from '@/components/site/section-reveal'
import { whyChooseNebuloid } from '@/lib/digital-data'

export function WhyChooseSection() {
  return (
    <section id="why-nebuloid" className="section-padding">
      <div className="content-grid">
        <SectionReveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            Why Nebuloid
          </p>
          <h2 className="mt-4 max-w-4xl text-[clamp(2rem,4.5vw,4.5rem)] font-bold leading-tight tracking-[-0.03em]">
            Why Organizations Choose Nebuloid
          </h2>
        </SectionReveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseNebuloid.map((item, index) => (
            <SectionReveal key={item.title} delay={index * 0.05}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.35 }}
                className="group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-colors hover:border-[#d4af37]/25 hover:bg-white/[0.05] md:p-7"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10">
                  <Check size={16} className="text-[#d4af37]" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-[#F1E9DB]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#F1E9DB]/55">
                  {item.description}
                </p>
              </motion.div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
