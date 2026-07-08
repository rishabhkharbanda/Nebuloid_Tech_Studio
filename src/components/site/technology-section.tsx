'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { SectionReveal } from '@/components/site/section-reveal'
import { technologies } from '@/lib/site-data'

export function TechnologySection() {
  return (
    <section id="technology" className="section-padding">
      <div className="content-grid">
        <SectionReveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            Technology
          </p>
          <h2 className="mt-4 max-w-4xl text-[clamp(2rem,4.5vw,4.5rem)] font-bold leading-tight tracking-[-0.03em]">
            The invisible layer that makes every moment feel effortless.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#F1E9DB]/65 md:text-lg">
            We engineer the systems behind the experience — kiosks, AI, navigation,
            registration, and live intelligence — so your audience never sees the
            seams.
          </p>
          <Link
            href="/technology"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#F1E9DB]/50 transition-colors hover:text-[#d4af37]"
          >
            Explore all technology
            <ArrowUpRight size={16} />
          </Link>
        </SectionReveal>

        <SectionReveal delay={0.1} className="mt-14">
          <div className="flex flex-wrap gap-3 md:gap-4">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04, duration: 0.45 }}
                whileHover={{ scale: 1.03 }}
              >
                <Link
                  href={`/technology/${tech.slug}`}
                  className="inline-block rounded-full border border-white/10 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#F1E9DB]/70 transition-colors duration-300 hover:border-[#d4af37]/40 hover:text-[#F1E9DB]"
                >
                  {tech.title}
                </Link>
              </motion.div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
