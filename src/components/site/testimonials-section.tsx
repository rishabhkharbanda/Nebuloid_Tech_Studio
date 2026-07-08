'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { SectionReveal } from '@/components/site/section-reveal'
import { testimonials } from '@/lib/site-data'
import { cn } from '@/lib/utils'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function TestimonialsSection() {
  const [index, setIndex] = useState(0)
  const total = testimonials.length

  const goTo = useCallback(
    (next: number) => {
      setIndex((next + total) % total)
    },
    [total],
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % total)
    }, 5500)
    return () => clearInterval(timer)
  }, [total])

  const active = testimonials[index]

  return (
    <section className="section-padding">
      <div className="content-grid">
        <SectionReveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            Testimonials
          </p>
          <h2 className="mt-4 max-w-3xl text-[clamp(2rem,4.5vw,4rem)] font-bold leading-tight tracking-[-0.03em] text-[#F1E9DB]">
            What changes when the experience is designed as one.
          </h2>
        </SectionReveal>

        <SectionReveal delay={0.08} className="mt-14 border-y border-white/10">
          <div className="grid gap-10 py-12 md:grid-cols-12 md:items-end md:gap-12 md:py-16 lg:py-20">
            {/* Navigation + counter */}
            <div className="flex items-center justify-between md:col-span-3 md:flex-col md:items-start md:justify-between md:gap-10">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#F1E9DB]/45">
                {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => goTo(index - 1)}
                  aria-label="Previous testimonial"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-[#F1E9DB]/60 transition-colors hover:border-[#d4af37]/50 hover:text-[#d4af37]"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(index + 1)}
                  aria-label="Next testimonial"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-[#F1E9DB]/60 transition-colors hover:border-[#d4af37]/50 hover:text-[#d4af37]"
                >
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="hidden gap-2 md:flex">
                {testimonials.map((item, i) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-500',
                      i === index
                        ? 'w-10 bg-[#d4af37]'
                        : 'w-3 bg-white/15 hover:bg-white/30',
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Quote */}
            <div className="md:col-span-9">
              <span className="text-display-filled text-6xl leading-none text-[#d4af37]/40 md:text-8xl">
                &ldquo;
              </span>

              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={active.name}
                  initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -28, filter: 'blur(10px)' }}
                  transition={{ duration: 0.55, ease: [0.2, 0.65, 0.3, 0.9] }}
                >
                  <p className="max-w-4xl text-[clamp(1.6rem,3.8vw,3.4rem)] font-medium leading-[1.15] tracking-[-0.02em] text-[#F1E9DB]">
                    {active.quote}
                  </p>

                  <footer className="mt-10 flex items-center gap-4 border-t border-white/10 pt-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 font-mono text-xs text-[#d4af37]">
                      {getInitials(active.name)}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-[#F1E9DB]">
                        {active.name}
                      </p>
                      <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-[#F1E9DB]/50">
                        {active.role}
                      </p>
                    </div>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
