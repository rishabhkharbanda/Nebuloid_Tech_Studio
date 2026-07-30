'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { ArcadeCabinets } from '@/components/site/arcade-cabinets'
import { BrandLogo } from '@/components/site/brand-logo'
import { MagneticButton } from '@/components/site/magnetic-button'
import { Button } from '@/components/ui/button'

const steps = [
  {
    num: '01',
    title: 'Drop in the SDK',
    body: 'One package with native wrappers for iOS, Android, and web — without rebuilding auth or your backend.',
  },
  {
    num: '02',
    title: 'Map your reward logic',
    body: 'Point each cabinet at purchases, streaks, or referrals you already track, then set the payout table.',
  },
  {
    num: '03',
    title: 'Ship, measure, expand',
    body: 'Launch one game behind a flag, compare retention against a holdout, then roll out the rest.',
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
}

export function ArcadeLanding() {
  const router = useRouter()

  return (
    <div className="theme-preserve-dark">
      <section className="relative isolate min-h-[100svh] overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(90% 70% at 50% -10%, rgba(212,175,55,0.14), transparent 55%), linear-gradient(180deg, #12100c 0%, #090909 48%, #090909 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(241,233,219,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(241,233,219,0.04) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
          }}
        />

        <div className="content-grid relative z-10 flex min-h-[100svh] flex-col justify-center px-6 pb-20 pt-28 md:px-10 md:pb-28 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3"
          >
            <BrandLogo className="h-11 w-11 md:h-14 md:w-14" priority />
            <div>
              <p className="font-[family-name:var(--font-bebas-neue)] text-[clamp(2.4rem,8vw,4.5rem)] leading-none tracking-[0.04em] text-[#F1E9DB]">
                Nebuloid
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.28em] text-[#d4af37]">
                Arcade
              </p>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 max-w-4xl text-[clamp(2.1rem,5.5vw,4.2rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-[#F1E9DB]"
          >
            Give every screen a reason to{' '}
            <span className="text-gradient-gold">come back.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-base leading-relaxed text-[#F1E9DB]/72 sm:text-lg"
          >
            Four drop-in mini-games — wheel, reels, race, and range — wired into your
            reward logic. Play them below, then ship them as a native engagement layer.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <MagneticButton
              size="lg"
              onClick={() =>
                document.getElementById('arcade')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Play the games <ArrowDown size={18} />
            </MagneticButton>
            <Button variant="outline" size="lg" onClick={() => router.push('/contact')}>
              Book a demo <ArrowUpRight size={18} />
            </Button>
          </motion.div>
        </div>
      </section>

      <section id="arcade" className="section-padding border-t border-white/10">
        <div className="content-grid">
          <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold tracking-[-0.03em]">
              Four cabinets. One SDK.
            </h2>
            <p className="mt-3 text-[#F1E9DB]/65">
              Each cabinet is a self-contained reward mechanic — try them, then swap the
              skin and keep the payout logic.
            </p>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.08 }}
            className="mt-12 md:mt-16"
          >
            <ArcadeCabinets />
          </motion.div>

          <motion.div
            {...fadeUp}
            className="mt-14 grid gap-8 border-y border-white/10 py-10 sm:grid-cols-3 sm:gap-6"
          >
            {[
              { value: '+38%', label: 'avg. session length' },
              { value: '2 days', label: 'typical SDK integration' },
              { value: '4', label: 'reward mechanics, one config' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-[family-name:var(--font-bebas-neue)] text-4xl tracking-[0.04em] text-[#d4af37] md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-[#F1E9DB]/55">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="content-grid">
          <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
            <h2 className="text-[clamp(1.75rem,3.5vw,2.6rem)] font-semibold tracking-[-0.03em]">
              How it plugs into your experience
            </h2>
            <p className="mt-3 text-[#F1E9DB]/65">
              Three steps — no rebuild of your reward system.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.num}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: index * 0.06 }}
                className="border-t border-[#d4af37]/35 pt-6"
              >
                <p className="font-mono text-xs tracking-[0.18em] text-[#F1E9DB]/4">
                  {step.num}
                </p>
                <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em]">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#F1E9DB]/6">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="cta"
        className="relative overflow-hidden border-t border-white/10 px-6 py-24 text-center md:py-32"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(50% 80% at 50% 100%, rgba(212,175,55,0.12), transparent 70%)',
          }}
        />
        <motion.div {...fadeUp} className="relative mx-auto max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#d4af37]">
            Ready when you are
          </p>
          <h2 className="mt-5 text-[clamp(1.7rem,3.8vw,2.8rem)] font-semibold tracking-[-0.03em]">
            Make retention feel like a game, not a growth hack.
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <MagneticButton size="lg" onClick={() => router.push('/contact')}>
              Book a demo <ArrowUpRight size={18} />
            </MagneticButton>
            <Button variant="outline" size="lg" onClick={() => router.push('/experiences')}>
              View experiences
            </Button>
          </div>
          <p className="mt-10 text-xs text-[#F1E9DB]/4">
            Nebuloid Arcade is an engagement layer for apps and venues — not a real-money
            gaming product.
          </p>
        </motion.div>
      </section>
    </div>
  )
}
