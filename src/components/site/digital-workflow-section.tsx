'use client'

import { motion } from 'framer-motion'
import { SectionReveal } from '@/components/site/section-reveal'
import { digitalWorkflow } from '@/lib/digital-data'

export function DigitalWorkflowSection() {
  return (
    <section id="digital-process" className="section-padding border-y border-white/10">
      <div className="content-grid">
        <SectionReveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            Our Approach
          </p>
          <h2 className="mt-4 max-w-4xl text-[clamp(2rem,4.5vw,4.8rem)] font-bold tracking-[-0.03em]">
            How We Build Digital Experiences
          </h2>
        </SectionReveal>

        {/* Mobile / tablet: vertical stack */}
        <div className="mt-14 space-y-8 lg:hidden">
          {digitalWorkflow.map((item, index) => (
            <SectionReveal key={item.step} delay={index * 0.05}>
              <div className="relative border-l border-[#d4af37]/35 pl-5">
                <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#d4af37]" />
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F1E9DB]/45">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-2 text-lg font-semibold">{item.step}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#F1E9DB]/55">
                  {item.description}
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* Desktop: horizontal timeline */}
        <div className="mt-14 hidden lg:block">
          <div className="relative grid grid-cols-7 gap-4">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="absolute top-[1.05rem] col-span-7 h-px origin-left bg-gradient-to-r from-[#d4af37]/20 via-[#d4af37] to-[#d4af37]/20"
            />
            {digitalWorkflow.map((item, index) => (
              <SectionReveal key={item.step} delay={index * 0.07}>
                <div className="relative">
                  <motion.div
                    whileInView={{ scale: [0.8, 1.1, 1] }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="h-8 w-8 rounded-full border border-[#d4af37] bg-[#090909] shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                  />
                  <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[#F1E9DB]/45">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold md:text-xl">{item.step}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#F1E9DB]/55 md:text-sm">
                    {item.description}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
