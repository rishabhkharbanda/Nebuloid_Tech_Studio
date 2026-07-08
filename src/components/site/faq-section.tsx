'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionReveal } from '@/components/site/section-reveal'
import { faqs } from '@/lib/site-data'
import { cn } from '@/lib/utils'

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="section-padding">
      <div className="content-grid">
        <SectionReveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            FAQs
          </p>
          <h2 className="mt-4 max-w-3xl text-[clamp(2rem,4.5vw,4rem)] font-bold leading-tight tracking-[-0.03em]">
            Questions worth asking before your next event.
          </h2>
        </SectionReveal>

        <div className="mt-14 divide-y divide-white/10 border-y border-white/10">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <SectionReveal key={faq.question} delay={index * 0.05}>
                <div className="py-6 md:py-8">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-start justify-between gap-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-lg font-semibold leading-snug tracking-[-0.02em] text-[#F1E9DB] md:text-xl">
                      {faq.question}
                    </span>
                    <span
                      className={cn(
                        'mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-[#F1E9DB]/60 transition-all duration-300',
                        isOpen && 'rotate-180 border-[#d4af37]/40 text-[#d4af37]',
                      )}
                    >
                      <ChevronDown size={16} />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-3xl pt-5 leading-relaxed text-[#F1E9DB]/65 md:text-lg">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </SectionReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
