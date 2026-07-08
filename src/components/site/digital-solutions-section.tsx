'use client'

import { motion } from 'framer-motion'
import {
  Bot,
  Gamepad2,
  Globe,
  Layout,
  Monitor,
  QrCode,
  Sparkles,
  BarChart3,
  Layers,
  Zap,
} from 'lucide-react'
import { SectionReveal } from '@/components/site/section-reveal'
import { digitalSolutions } from '@/lib/digital-data'

const iconMap = [
  Layers,
  Bot,
  Sparkles,
  Gamepad2,
  Monitor,
  Globe,
  Layout,
  Zap,
  Sparkles,
  Monitor,
  QrCode,
  BarChart3,
  Layout,
  Zap,
  BarChart3,
]

export function DigitalSolutionsSection() {
  return (
    <section id="digital-solutions" className="section-padding border-y border-white/10">
      <div className="content-grid">
        <SectionReveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            Capabilities
          </p>
          <h2 className="mt-4 max-w-4xl text-[clamp(2rem,5vw,5rem)] font-bold leading-tight tracking-[-0.03em]">
            Our Digital Experience Solutions
          </h2>
        </SectionReveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {digitalSolutions.map((solution, index) => {
            const Icon = iconMap[index % iconMap.length]

            return (
              <SectionReveal key={solution} delay={index * 0.04}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.4, ease: [0.2, 0.65, 0.3, 0.9] }}
                  className="group h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-colors duration-500 hover:border-[#d4af37]/30 hover:bg-white/[0.07] md:p-8"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10 text-[#d4af37] transition-colors group-hover:border-[#d4af37]/40 group-hover:bg-[#d4af37]/15">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-[#F1E9DB] transition-colors group-hover:text-[#d4af37]">
                    {solution}
                  </h3>
                </motion.div>
              </SectionReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
