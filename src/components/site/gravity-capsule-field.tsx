'use client'

import Link from 'next/link'
import {
  motion,
  useInView,
  useReducedMotion,
  type Transition,
} from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export type CapsuleItem = {
  slug: string
  label: string
  category?: string
}

type GravityCapsuleFieldProps = {
  items: readonly CapsuleItem[]
  hrefPrefix: string
  className?: string
  activeSlug?: string | null
  onActiveChange?: (slug: string | null) => void
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

const categoryColors: Record<string, string> = {
  Interactive: '#6c9eff',
  AI: '#d4af37',
  Digital: '#9b8cff',
  Analytics: '#5fd4a4',
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
    rotateX: 10,
    zIndex: index + 1,
  }))
}

function buildScatterPoses(count: number): ScatterPose[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2 - Math.PI / 2
    const ring = index % 3
    const radiusX = 108 + ring * 36
    const radiusY = 78 + ring * 30

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
  activeSlug: controlledActiveSlug,
  onActiveChange,
}: GravityCapsuleFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true, margin: '-8% 0px' })
  const [internalActiveSlug, setInternalActiveSlug] = useState<string | null>(null)
  const [scattered, setScattered] = useState(false)
  const [pointer, setPointer] = useState({ x: 50, y: 50 })
  const [compact, setCompact] = useState(false)
  const reduceMotion = useReducedMotion()

  const activeSlug = controlledActiveSlug ?? internalActiveSlug

  const setActiveSlug = useCallback(
    (slug: string | null) => {
      if (onActiveChange) onActiveChange(slug)
      else setInternalActiveSlug(slug)
    },
    [onActiveChange],
  )

  const stackPoses = useMemo(() => buildStackPoses(items.length), [items.length])
  const scatterPoses = useMemo(() => buildScatterPoses(items.length), [items.length])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)')
    const update = () => setCompact(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = containerRef.current?.getBoundingClientRect()
    if (!bounds) return
    setPointer({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    })
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
              onMouseEnter={() => setActiveSlug(item.slug)}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#F1E9DB]/75 backdrop-blur-xl transition-colors hover:border-[#d4af37]/45 hover:text-[#F1E9DB]"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: categoryColors[item.category ?? 'Digital'] }}
              />
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
      onPointerMove={handlePointerMove}
      onMouseEnter={() => !reduceMotion && setScattered(true)}
      onMouseLeave={() => {
        setScattered(false)
        setPointer({ x: 50, y: 50 })
      }}
      className={cn(
        'relative min-h-[540px] overflow-hidden rounded-[2rem] border border-white/10',
        'bg-[radial-gradient(circle_at_50%_100%,rgba(212,175,55,0.12),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(9,9,9,0.55))]',
        className,
      )}
      style={{ perspective: '1500px' }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgba(212,175,55,0.14), transparent 42%)`,
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]" />

      <motion.div
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.07]"
      />
      <motion.div
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 64, repeat: Infinity, ease: 'linear' }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#d4af37]/10"
      />

      <div className="pointer-events-none absolute left-1/2 top-[60%] h-32 w-[76%] -translate-x-1/2 rounded-[100%] bg-black/55 blur-2xl" />

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
          const accent = categoryColors[item.category ?? 'Digital']

          return (
            <motion.div
              key={item.slug}
              layout
              className="absolute left-1/2 top-1/2"
              style={{
                zIndex: isActive ? 100 : isScattered ? 20 + index : stack.zIndex,
                transformStyle: 'preserve-3d',
              }}
              initial={
                reduceMotion
                  ? { opacity: 0, x: 0, y: 0 }
                  : { opacity: 0, x: 0, y: -440, rotateZ: 0, rotateX: 20, scale: 0.9 }
              }
              animate={
                !inView
                  ? { opacity: 0, x: 0, y: -440, rotateZ: 0, rotateX: 20, scale: 0.9 }
                  : {
                      opacity: 1,
                      x: pose.x,
                      y: pose.y,
                      rotateZ: isActive ? 0 : pose.rotateZ,
                      rotateX: isScattered ? 0 : stack.rotateX,
                      scale: isActive ? 1.1 : isScattered ? scatter.scale : 1,
                    }
              }
              transition={{
                ...spring,
                layout: { type: 'spring', stiffness: 200, damping: 24 },
                delay: reduceMotion ? 0 : inView ? index * 0.06 : 0,
                ...(inView && !scattered && !reduceMotion
                  ? { y: { ...dropSpring, delay: index * 0.08 } }
                  : {}),
              }}
            >
              <Link
                href={`${hrefPrefix}/${item.slug}`}
                onMouseEnter={() => setActiveSlug(item.slug)}
                onMouseLeave={() => setActiveSlug(null)}
                className={cn(
                  'group relative inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] backdrop-blur-xl transition-[border-color,background-color,color,box-shadow] duration-300',
                  isActive
                    ? 'border-[#d4af37]/60 bg-[#d4af37]/16 text-[#F1E9DB] shadow-[0_14px_44px_rgba(212,175,55,0.28),0_2px_0_rgba(255,255,255,0.1)_inset]'
                    : 'border-white/14 bg-white/[0.07] text-[#F1E9DB]/78 shadow-[0_10px_30px_rgba(0,0,0,0.35),0_1px_0_rgba(255,255,255,0.06)_inset] hover:border-white/25 hover:text-[#F1E9DB]',
                )}
                style={{
                  transform: 'translateZ(16px)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <span
                  className="h-2 w-2 rounded-full shadow-[0_0_10px_currentColor]"
                  style={{ backgroundColor: accent, color: accent }}
                />
                {item.label}
              </Link>
            </motion.div>
          )
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-5 flex items-center justify-between px-6">
        <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#F1E9DB]/40 backdrop-blur-md">
          {items.length} systems
        </span>
        <span className="rounded-full border border-white/10 bg-black/35 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/40 backdrop-blur-md">
          {scattered ? 'Restacking…' : 'Hover to scatter'}
        </span>
      </div>
    </div>
  )
}
