'use client'

import { useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { SectionReveal } from '@/components/site/section-reveal'
import { stats } from '@/lib/site-data'

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

export function StatsSection() {
  return (
    <section className="section-padding">
      <div className="content-grid">
        <SectionReveal className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-white/10 bg-white/[0.02] p-8"
            >
              <p className="text-6xl font-bold tracking-[-0.03em]">
                <Counter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-[#F1E9DB]/60">
                {stat.label}
              </p>
            </div>
          ))}
        </SectionReveal>
      </div>
    </section>
  )
}
