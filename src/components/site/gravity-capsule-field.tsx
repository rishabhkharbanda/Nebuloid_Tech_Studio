'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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

type LayoutPoint = {
  x: number
  y: number
  floatDuration: number
  floatDelay: number
}

function buildLayout(count: number): LayoutPoint[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = index * 2.399963
    const radius = 72 + (index % 5) * 28
    return {
      x: 50 + Math.cos(angle) * (radius / 9.5),
      y: 48 + Math.sin(angle) * (radius / 7.5),
      floatDuration: 4.2 + (index % 4) * 0.65,
      floatDelay: index * 0.18,
    }
  })
}

export function GravityCapsuleField({
  items,
  hrefPrefix,
  className,
}: GravityCapsuleFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 })
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)
  const [compact, setCompact] = useState(false)
  const reduceMotion = useReducedMotion()

  const layouts = useMemo(() => buildLayout(items.length), [items.length])

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
      x: (event.clientX - bounds.left) / bounds.width,
      y: (event.clientY - bounds.top) / bounds.height,
    })
  }, [])

  const resetPointer = useCallback(() => {
    setPointer({ x: 0.5, y: 0.5 })
    setHoveredSlug(null)
  }, [])

  const hoveredLayout = hoveredSlug
    ? layouts[items.findIndex((item) => item.slug === hoveredSlug)]
    : null

  if (compact) {
    return (
      <div className={cn('flex flex-wrap justify-center gap-3 md:gap-4', className)}>
        {items.map((item, index) => (
          <motion.div
            key={item.slug}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04, duration: 0.45 }}
            whileHover={reduceMotion ? undefined : { scale: 1.05, y: -4 }}
          >
            <Link
              href={`${hrefPrefix}/${item.slug}`}
              className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#F1E9DB]/75 backdrop-blur-md transition-colors hover:border-[#d4af37]/45 hover:text-[#F1E9DB]"
            >
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
      onPointerLeave={resetPointer}
      className={cn(
        'relative min-h-[440px] overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.08),transparent_42%),radial-gradient(circle_at_75%_75%,rgba(108,124,255,0.06),transparent_38%)] backdrop-blur-sm',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(9,9,9,0.35))]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4af37]/10 blur-3xl" />

      {items.map((item, index) => {
        const layout = layouts[index]
        const isHovered = hoveredSlug === item.slug

        const pointerPullX = reduceMotion ? 0 : (pointer.x - 0.5) * 42
        const pointerPullY = reduceMotion ? 0 : (pointer.y - 0.5) * 28

        let clusterX = 0
        let clusterY = 0
        if (!reduceMotion && hoveredLayout && !isHovered) {
          const dx = hoveredLayout.x - layout.x
          const dy = hoveredLayout.y - layout.y
          const distance = Math.hypot(dx, dy) || 1
          const pull = Math.max(0, 1 - distance / 34) * 10
          clusterX = (dx / distance) * pull
          clusterY = (dy / distance) * pull
        }

        return (
          <motion.div
            key={item.slug}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${layout.x}%`, top: `${layout.y}%` }}
            animate={
              reduceMotion
                ? { x: 0, y: 0, scale: isHovered ? 1.06 : 1 }
                : {
                    x: pointerPullX + clusterX,
                    y: pointerPullY + clusterY,
                    scale: isHovered ? 1.1 : 1,
                  }
            }
            transition={{ type: 'spring', stiffness: 110, damping: 16, mass: 0.7 }}
          >
            <motion.div
              animate={
                reduceMotion
                  ? undefined
                  : { y: [0, -7, 0, 5, 0] }
              }
              transition={{
                duration: layout.floatDuration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: layout.floatDelay,
              }}
            >
              <Link
                href={`${hrefPrefix}/${item.slug}`}
                onMouseEnter={() => setHoveredSlug(item.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                className={cn(
                  'group inline-flex items-center gap-2 rounded-full border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] backdrop-blur-xl transition-colors duration-300',
                  isHovered
                    ? 'border-[#d4af37]/55 bg-[#d4af37]/15 text-[#F1E9DB] shadow-[0_0_30px_rgba(212,175,55,0.2)]'
                    : 'border-white/12 bg-white/[0.06] text-[#F1E9DB]/72 hover:border-[#d4af37]/35 hover:text-[#F1E9DB]',
                )}
              >
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full transition-colors',
                    isHovered ? 'bg-[#d4af37]' : 'bg-[#F1E9DB]/35 group-hover:bg-[#d4af37]/70',
                  )}
                />
                {item.label}
              </Link>
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}
