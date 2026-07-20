'use client'

import { motion } from 'framer-motion'
import { SectionReveal } from '@/components/site/section-reveal'
import { digitalSpecializations } from '@/lib/digital-data'

export function DigitalSpecializationsSection() {
  return (
    <section id="digital-tech" className="section-padding overflow-hidden">
      <div className="content-grid">
        <SectionReveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            Expertise
          </p>
          <h2 className="mt-4 max-w-4xl text-[clamp(2rem,4.5vw,4.5rem)] font-bold leading-tight tracking-[-0.03em]">
            Technologies We Specialise In
          </h2>
        </SectionReveal>

        <SectionReveal delay={0.1} className="relative mt-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,.06),transparent_60%)]" />
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {digitalSpecializations.map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03, duration: 0.5 }}
                whileHover={{ scale: 1.06 }}
                className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#F1E9DB]/70 backdrop-blur-md transition-colors hover:border-[#d4af37]/40 hover:text-[#F1E9DB]"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
