'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from 'gsap'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { MagneticButton } from '@/components/site/magnetic-button'
import { heroStates } from '@/lib/site-data'
import { cn } from '@/lib/utils'

const SLIDE_INTERVAL = 3900

export function HeroSection() {
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -120])
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroStates.length)
    }, SLIDE_INTERVAL)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
    timeline
      .fromTo(titleRef.current, { y: 54, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 })
      .fromTo(
        descriptionRef.current,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65 },
        '-=0.45',
      )
    return () => {
      timeline.kill()
    }
  }, [])

  const active = useMemo(() => heroStates[activeIndex], [activeIndex])

  return (
    <section
      id="home"
      className="theme-preserve-dark relative isolate min-h-screen overflow-hidden pt-32"
    >
      <div className="absolute inset-0 z-0">
        <motion.div style={{ y }} className="absolute inset-0">
          <AnimatePresence initial={false}>
            <motion.div
              key={active.title}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={active.image}
                alt={`${active.title.replace('.', '')} — event experience by Nebuloid Tech Studio`}
                fill
                priority={activeIndex === 0}
                unoptimized
                className="object-cover"
                sizes="100vw"
              />
              <div
                className={`before:absolute before:inset-0 before:content-[''] absolute inset-0 bg-gradient-to-br ${active.classes}`}
              />
              <div className="absolute inset-0 bg-[#090909]/35" />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="content-grid section-padding relative z-10 flex min-h-[calc(100vh-8rem)] flex-col justify-center">
        <h1 ref={titleRef} className="mt-4 flex flex-wrap items-baseline gap-x-[0.15em]">
          <span className="text-display-filled text-[clamp(3.5rem,11vw,9rem)]">We</span>
          <span className="text-outline-display text-[clamp(3.5rem,11vw,9rem)]">Create</span>
        </h1>

        <div className="h-[clamp(6rem,10vw,7rem)] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={active.title}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -60, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(2rem,6vw,5.4rem)] font-semibold leading-tight tracking-[-0.03em] text-[#F1E9DB]"
            >
              {active.title}
            </motion.p>
          </AnimatePresence>
        </div>

        <p
          ref={descriptionRef}
          className="mt-8 max-w-2xl text-lg text-[#F1E9DB]/75 md:text-xl"
        >
          Nebuloid designs, builds, and delivers complete event ecosystems — from
          branding and motion to kiosks, AI experiences, and digital engagement.
          One partner. One seamless experience.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton size="lg" onClick={() => router.push('/contact')}>
            Start Your Experience <ArrowUpRight size={18} />
          </MagneticButton>
          <Button
            variant="outline"
            size="lg"
            onClick={() =>
              document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            View Experiences
          </Button>
        </div>

        <div className="mt-14 flex items-center gap-3">
          {heroStates.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show slide: ${slide.title}`}
              className={cn(
                'h-1.5 rounded-full transition-all duration-500',
                index === activeIndex
                  ? 'w-12 bg-[#d4af37]'
                  : 'w-3 bg-[#F1E9DB]/25 hover:bg-[#F1E9DB]/45',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
