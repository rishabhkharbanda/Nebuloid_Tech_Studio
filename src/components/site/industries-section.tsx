'use client'

import { motion } from 'framer-motion'
import { SectionReveal } from '@/components/site/section-reveal'
import { industries } from '@/lib/site-data'

export function IndustriesSection() {
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
        </SectionReveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {industries.map((industry, index) => (
            <SectionReveal key={industry.title} delay={index * 0.06}>
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4, ease: [0.2, 0.65, 0.3, 0.9] }}
                className="group h-full rounded-3xl border border-white/10 bg-white/[0.02] p-8 transition-colors duration-500 hover:border-[#d4af37]/25 md:p-10"
              >
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4af37]/70">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-6 text-2xl font-semibold tracking-[-0.02em] text-[#F1E9DB] md:text-3xl">
                  {industry.title}
                </h3>
                <p className="mt-4 leading-relaxed text-[#F1E9DB]/65">
                  {industry.description}
                </p>
              </motion.article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
