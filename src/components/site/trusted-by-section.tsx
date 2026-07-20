'use client'

import { motion } from 'framer-motion'
import { SectionReveal } from '@/components/site/section-reveal'
import { trustedBy } from '@/lib/site-data'

export function TrustedBySection() {
  const items = [...trustedBy, ...trustedBy]

  return (
    <section className="border-y border-white/10 px-6 py-14 md:px-10 md:py-16 lg:px-16">
      <div className="content-grid">
        <SectionReveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#F1E9DB]/45">
            Trusted By Teams Across
          </p>
        </SectionReveal>

        <div className="relative mt-8 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#090909] to-transparent md:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#090909] to-transparent md:w-24" />

          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
            className="flex w-max items-center gap-12 md:gap-20"
          >
            {items.map((name, index) => (
              <span
                key={`${name}-${index}`}
                className="whitespace-nowrap font-mono text-sm uppercase tracking-[0.28em] text-[#F1E9DB]/35 md:text-base"
              >
                {name}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
