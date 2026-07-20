'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { SectionReveal } from '@/components/site/section-reveal'
import { MagneticButton } from '@/components/site/magnetic-button'
import { Button } from '@/components/ui/button'

export function DigitalCtaSection() {
  const router = useRouter()

  return (
    <section className="section-padding">
      <div className="content-grid">
        <SectionReveal>
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 24 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] px-8 py-16 backdrop-blur-xl md:px-16 md:py-20"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,.12),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(108,124,255,.08),transparent_40%)]" />

            <div className="relative z-10 mx-auto max-w-3xl text-center">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
                Start Building
              </p>
              <h2 className="mt-4 text-[clamp(2rem,5vw,4rem)] font-bold leading-tight tracking-[-0.03em]">
                Let&apos;s Build Your Next Digital Experience
              </h2>
              <p className="mt-6 text-base leading-relaxed text-[#F1E9DB]/65 md:text-lg">
                Whether you&apos;re building an international exhibition, a government
                platform, a religious tourism destination, or an AI-powered brand
                activation, Nebuloid develops technology that transforms ideas into
                engaging digital experiences.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <MagneticButton size="lg" onClick={() => router.push('/contact')}>
                  Start Your Project <ArrowUpRight size={18} />
                </MagneticButton>
                <Button
                  variant="outline"
                  size="lg"
                  className="min-w-[10.5rem]"
                  onClick={() => router.push('/digital-experiences')}
                >
                  View Our Work
                </Button>
              </div>
            </div>
          </motion.div>
        </SectionReveal>
      </div>
    </section>
  )
}
