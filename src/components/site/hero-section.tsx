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
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, -80])
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroStates.length)
    }, SLIDE_INTERVAL)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
    timeline
      .fromTo(titleRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
      .fromTo(
        descriptionRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.35',
      )
    return () => {
      timeline.kill()
    }
  }, [])

  const active = useMemo(() => heroStates[activeIndex], [activeIndex])
  const nextIndex = (activeIndex + 1) % heroStates.length

  useEffect(() => {
    const img = new window.Image()
    img.decoding = 'async'
    img.src = heroStates[nextIndex].image
  }, [nextIndex])

  return (
    <section
      ref={sectionRef}
      id="home"
      className="theme-preserve-dark relative isolate min-h-[100svh] overflow-hidden pt-24 md:pt-32"
    >
      <div className="absolute inset-0 z-0">
        <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
          <AnimatePresence initial={false}>
            <motion.div
              key={active.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={active.image}
                alt={`${active.title.replace('.', '')} — event experience by Nebuloid Tech Studio`}
                fill
                priority={activeIndex === 0}
                className="object-cover"
                sizes="100vw"
                quality={70}
              />
              <div
                className={`before:absolute before:inset-0 before:content-[''] absolute inset-0 bg-gradient-to-br ${active.classes}`}
              />
              <div className="absolute inset-0 bg-[#090909]/35" />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="content-grid relative z-10 flex min-h-[calc(100svh-6rem)] flex-col justify-center px-6 pb-16 pt-8 md:min-h-[calc(100svh-8rem)] md:px-10 md:pb-24 lg:px-16">
        <h1 ref={titleRef} className="mt-2 flex flex-wrap items-baseline gap-x-[0.15em] md:mt-4">
          <span className="text-display-filled text-[clamp(2.75rem,12vw,9rem)]">We</span>
          <span className="text-outline-display text-[clamp(2.75rem,12vw,9rem)]">Create</span>
        </h1>

        <div className="relative min-h-[4.8em] overflow-hidden sm:min-h-[3.4em]">
          <AnimatePresence mode="wait">
            <motion.p
              key={active.title}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -60, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(1.75rem,7vw,5.4rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[#F1E9DB]"
            >
              {active.title}
            </motion.p>
          </AnimatePresence>
        </div>

        <p
          ref={descriptionRef}
          className="mt-6 max-w-2xl text-base leading-relaxed text-[#F1E9DB]/75 sm:mt-8 sm:text-lg md:text-xl"
        >
          Nebuloid designs, builds, and delivers complete event ecosystems — from
          branding and motion to kiosks, AI experiences, and digital engagement.
          One partner. One seamless experience.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
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

        <div className="mt-10 flex max-w-full flex-wrap items-center gap-2 sm:mt-14 sm:gap-3">
          {heroStates.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show slide: ${slide.title}`}
              className={cn(
                'h-1.5 rounded-full transition-all duration-500',
                index === activeIndex
                  ? 'w-8 bg-[#d4af37] sm:w-12'
                  : 'w-2.5 bg-[#F1E9DB]/25 hover:bg-[#F1E9DB]/45 sm:w-3',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
