'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type GalleryItem = {
  src: string
  alt: string
  label?: string
}

type DetailGalleryCarouselProps = {
  items: GalleryItem[]
  aspect?: 'portrait' | 'video'
  autoplayMs?: number
}

export function DetailGalleryCarousel({
  items,
  aspect = 'video',
  autoplayMs = 4500,
}: DetailGalleryCarouselProps) {
  const [index, setIndex] = useState(0)
  const total = items.length

  const goTo = useCallback(
    (next: number) => {
      setIndex((next + total) % total)
    },
    [total],
  )

  useEffect(() => {
    if (total < 2) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % total)
    }, autoplayMs)
    return () => clearInterval(timer)
  }, [autoplayMs, total])

  if (total === 0) return null

  const active = items[index]
  const aspectClass = aspect === 'video' ? 'aspect-video' : 'aspect-[4/5]'

  return (
    <div className="mt-10">
      <div
        className={cn(
          'relative overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c]',
          aspectClass,
        )}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={active.src}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={active.src}
              alt={active.alt}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 90vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {active.label && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-5 md:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/80 md:text-xs">
              {active.label}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/45">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </p>
          </div>
        )}

        {total > 1 && (
          <div className="absolute right-4 top-4 z-10 flex items-center gap-2 md:right-5 md:top-5">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous image"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-[#F1E9DB]/75 backdrop-blur-sm transition-colors hover:border-[#d4af37]/50 hover:text-[#d4af37]"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next image"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-[#F1E9DB]/75 backdrop-blur-sm transition-colors hover:border-[#d4af37]/50 hover:text-[#d4af37]"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      {total > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {items.map((item, i) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={item.label ? `Show ${item.label}` : `Show image ${i + 1}`}
              aria-current={i === index}
              className={cn(
                'relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border transition-all md:h-20 md:w-32',
                i === index
                  ? 'border-[#d4af37]/70 ring-1 ring-[#d4af37]/40'
                  : 'border-white/10 opacity-55 hover:opacity-90',
              )}
            >
              <Image
                src={item.src}
                alt=""
                fill
                className="object-cover"
                sizes="128px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
