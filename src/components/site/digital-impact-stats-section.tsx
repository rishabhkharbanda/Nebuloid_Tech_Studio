'use client'

import { useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { SectionReveal } from '@/components/site/section-reveal'
import { digitalImpactStats } from '@/lib/digital-data'
import { cn } from '@/lib/utils'

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let current = 0
    const increment = Math.max(1, Math.ceil(target / 45))
    const interval = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(interval)
      }
      setValue(current)
    }, 28)
    return () => clearInterval(interval)
  }, [isInView, target])

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  )
}

export function DigitalImpactStatsSection() {
  return (
    <section className="section-padding border-y border-white/10">
      <div className="content-grid">
        <SectionReveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            Impact
          </p>
          <h2 className="mt-4 max-w-4xl text-[clamp(2rem,4.5vw,4.5rem)] font-bold leading-tight tracking-[-0.03em]">
            Delivering Digital Experiences That Create Impact
          </h2>
        </SectionReveal>

        <SectionReveal delay={0.1} className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          {digitalImpactStats.map((stat) => {
            const isText = 'isText' in stat && stat.isText

            return (
            <div
              key={stat.label}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition-colors hover:border-[#d4af37]/20"
            >
              <p
                className={cn(
                  'font-bold tracking-[-0.03em] text-[#F1E9DB]',
                  isText
                    ? 'text-[clamp(1.5rem,3vw,2.25rem)] leading-tight'
                    : 'text-5xl md:text-6xl',
                )}
              >
                {isText ? (
                  <>
                    {stat.value}
                    {stat.suffix}
                  </>
                ) : (
                  <Counter target={Number(stat.value)} suffix={stat.suffix} />
                )}
              </p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#F1E9DB]/55">
                {stat.label}
              </p>
            </div>
            )
          })}
        </SectionReveal>
      </div>
    </section>
  )
}
