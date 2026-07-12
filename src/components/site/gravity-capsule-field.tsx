'use client'

import Link from 'next/link'
import {
  motion,
  useInView,
  useReducedMotion,
  type Transition,
} from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type CapsuleItem = {
  slug: string
  label: string
}

type GravityCapsuleFieldProps = {
  items: readonly CapsuleItem[]
  hrefPrefix: string
  className?: string
}

type StackPose = {
  x: number
  y: number
  rotateZ: number
  rotateX: number
  zIndex: number
}

type ScatterPose = {
  x: number
  y: number
  rotateZ: number
  scale: number
}

const spring: Transition = {
  type: 'spring',
  stiffness: 140,
  damping: 18,
  mass: 0.85,
}

const dropSpring: Transition = {
  type: 'spring',
  stiffness: 120,
  damping: 14,
  mass: 1,
}

function buildStackPoses(count: number): StackPose[] {
  const stackHeight = (count - 1) * 34

  return Array.from({ length: count }, (_, index) => ({
    x: (index % 2 === 0 ? -1 : 1) * Math.min(8 + index * 5, 28),
    y: index * 34 - stackHeight / 2,
    rotateZ: (index % 2 === 0 ? -1 : 1) * (2 + (index % 3) * 1.2),
    rotateX: 8,
    zIndex: index + 1,
  }))
}

function buildScatterPoses(count: number): ScatterPose[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2 - Math.PI / 2
    const ring = index % 3
    const radiusX = 118 + ring * 38
    const radiusY = 88 + ring * 32

    return {
      x: Math.cos(angle + index * 0.15) * radiusX,
      y: Math.sin(angle + index * 0.1) * radiusY,
      rotateZ: Math.sin(index * 1.7) * 12,
      scale: 1,
    }
  })
}

export function GravityCapsuleField({
  items,
  hrefPrefix,
  className,
}: GravityCapsuleFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true, margin: '-8% 0px' })
  const [scattered, setScattered] = useState(false)
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const [compact, setCompact] = useState(false)
  const reduceMotion = useReducedMotion()

  const stackPoses = useMemo(() => buildStackPoses(items.length), [items.length])
  const scatterPoses = useMemo(() => buildScatterPoses(items.length), [items.length])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)')
    const update = () => setCompact(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  if (compact) {
    return (
      <div className={cn('flex flex-wrap justify-center gap-3', className)}>
        {items.map((item, index) => (
          <motion.div
            key={item.slug}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04, duration: 0.45 }}
            whileHover={reduceMotion ? undefined : { scale: 1.04, y: -3 }}
          >
            <Link
              href={`${hrefPrefix}/${item.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#F1E9DB]/75 backdrop-blur-xl transition-colors hover:border-[#d4af37]/45 hover:text-[#F1E9DB]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#F1E9DB]/35" />
              {item.label}
            </Link>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => !reduceMotion && setScattered(true)}
      onMouseLeave={() => {
        setScattered(false)
        setActiveSlug(null)
      }}
      className={cn(
        'relative min-h-[500px] overflow-hidden rounded-[2rem] border border-white/10',
        'bg-[radial-gradient(circle_at_50%_100%,rgba(212,175,55,0.1),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(9,9,9,0.4))]',
        className,
      )}
      style={{ perspective: '1400px' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <div className="pointer-events-none absolute left-1/2 top-[58%] h-28 w-[72%] -translate-x-1/2 rounded-[100%] bg-black/50 blur-2xl" />

      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {items.map((item, index) => {
          const stack = stackPoses[index]
          const scatter = scatterPoses[index]
          const isActive = activeSlug === item.slug
          const isScattered = scattered && !reduceMotion
          const pose = isScattered ? scatter : stack

          return (
            <motion.div
              key={item.slug}
              className="absolute left-1/2 top-1/2"
              style={{
                zIndex: isActive ? 100 : isScattered ? 20 + index : stack.zIndex,
                transformStyle: 'preserve-3d',
              }}
              initial={
                reduceMotion
                  ? { opacity: 0, x: 0, y: 0 }
                  : { opacity: 0, x: 0, y: -420, rotateZ: 0, rotateX: 18, scale: 0.92 }
              }
              animate={
                !inView
                  ? { opacity: 0, x: 0, y: -420, rotateZ: 0, rotateX: 18, scale: 0.92 }
                  : {
                      opacity: 1,
                      x: pose.x,
                      y: pose.y,
                      rotateZ: isActive ? 0 : pose.rotateZ,
                      rotateX: isScattered ? 0 : stack.rotateX,
                      scale: isActive ? 1.08 : isScattered ? scatter.scale : 1,
                    }
              }
              transition={{
                ...spring,
                delay: reduceMotion ? 0 : inView ? index * 0.07 : 0,
                ...(inView && !scattered && !reduceMotion
                  ? { y: { ...dropSpring, delay: index * 0.09 } }
                  : {}),
              }}
            >
              <Link
                href={`${hrefPrefix}/${item.slug}`}
                onMouseEnter={() => setActiveSlug(item.slug)}
                onMouseLeave={() => setActiveSlug(null)}
                className={cn(
                  'group relative inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] backdrop-blur-xl transition-[border-color,background-color,color,box-shadow] duration-300',
                  isActive || isScattered
                    ? 'border-[#d4af37]/55 bg-[#d4af37]/14 text-[#F1E9DB] shadow-[0_12px_40px_rgba(212,175,55,0.22),0_2px_0_rgba(255,255,255,0.08)_inset]'
                    : 'border-white/14 bg-white/[0.07] text-[#F1E9DB]/78 shadow-[0_10px_30px_rgba(0,0,0,0.35),0_1px_0_rgba(255,255,255,0.06)_inset] hover:border-[#d4af37]/40 hover:text-[#F1E9DB]',
                )}
                style={{
                  transform: 'translateZ(12px)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full transition-colors',
                    isActive ? 'bg-[#d4af37]' : 'bg-[#F1E9DB]/35 group-hover:bg-[#d4af37]/80',
                  )}
                />
                {item.label}
              </Link>
            </motion.div>
          )
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center">
        <span className="rounded-full border border-white/10 bg-black/30 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/40 backdrop-blur-md">
          {scattered ? 'Releasing…' : 'Hover to scatter'}
        </span>
      </div>
    </div>
  )
}
