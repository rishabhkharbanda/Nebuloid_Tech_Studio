'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'
import { scrollExploreSections } from '@/lib/site-data'
import { cn } from '@/lib/utils'

const FRAME_COUNT = 300
const SCROLL_VH = 280
const FRAME_BASE = '/assets/scroll-sequence-web/ezgif-frame-'
const MAX_CANVAS_WIDTH = 1600
const SECTIONS = scrollExploreSections
const SECTION_COUNT = SECTIONS.length

function frameSrc(index: number) {
  return `${FRAME_BASE}${String(index + 1).padStart(3, '0')}.jpg`
}

type FrameSource = HTMLImageElement | ImageBitmap

function getCanvasMetrics(canvas: HTMLCanvasElement) {
  const parent = canvas.parentElement
  if (!parent) return null

  const cssWidth = parent.clientWidth
  const cssHeight = parent.clientHeight
  if (cssWidth <= 0 || cssHeight <= 0) return null

  const dpr = Math.min(window.devicePixelRatio || 1, cssWidth > 900 ? 1.5 : 1.25)
  const pixelWidth = Math.max(1, Math.min(MAX_CANVAS_WIDTH, Math.round(cssWidth * dpr)))
  const pixelHeight = Math.max(1, Math.round(pixelWidth * (cssHeight / cssWidth)))

  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth
    canvas.height = pixelHeight
    canvas.style.width = `${cssWidth}px`
    canvas.style.height = `${cssHeight}px`
  }

  return { pixelWidth, pixelHeight }
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  image: FrameSource,
  pixelWidth: number,
  pixelHeight: number,
) {
  const sourceWidth = 'naturalWidth' in image ? image.naturalWidth : image.width
  const sourceHeight = 'naturalHeight' in image ? image.naturalHeight : image.height
  const imgRatio = sourceWidth / sourceHeight
  const canvasRatio = pixelWidth / pixelHeight

  let drawWidth: number
  let drawHeight: number
  let offsetX: number
  let offsetY: number

  if (imgRatio > canvasRatio) {
    drawHeight = pixelHeight
    drawWidth = Math.round(sourceWidth * (pixelHeight / sourceHeight))
    offsetX = Math.round((pixelWidth - drawWidth) / 2)
    offsetY = 0
  } else {
    drawWidth = pixelWidth
    drawHeight = Math.round(sourceHeight * (pixelWidth / sourceWidth))
    offsetX = 0
    offsetY = Math.round((pixelHeight - drawHeight) / 2)
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'medium'
  ctx.clearRect(0, 0, pixelWidth, pixelHeight)
  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)
}

async function loadFrame(index: number): Promise<FrameSource> {
  const src = frameSrc(index)

  if (typeof createImageBitmap === 'function') {
    const response = await fetch(src)
    if (!response.ok) throw new Error(`Failed to load frame ${index + 1}`)
    const blob = await response.blob()
    return createImageBitmap(blob)
  }

  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load frame ${index + 1}`))
    img.src = src
  })
}

function ScrollHint({ visible }: { visible: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex flex-col items-center gap-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 10 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden={!visible}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#F1E9DB]/55">
        Scroll to Explore
      </p>
      <div className="relative flex h-11 w-7 items-start justify-center rounded-full border border-[#F1E9DB]/35 pt-2">
        <motion.span
          className="h-1.5 w-1 rounded-full bg-[#d4af37]"
          animate={{ y: [0, 12, 0], opacity: [1, 0.35, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  )
}

export function ScrollExploreSequence() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const framesRef = useRef<FrameSource[]>([])
  const frameRef = useRef(-1)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const pendingFrameRef = useRef(0)
  const rafRef = useRef(0)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const sectionIndexRef = useRef(0)

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [loadProgress, setLoadProgress] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [sectionIndex, setSectionIndex] = useState(0)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const section = sectionRef.current
    const pin = pinRef.current
    const canvas = canvasRef.current
    if (!section || !pin || !canvas) return

    let cancelled = false
    let resizeObserver: ResizeObserver | null = null
    ctxRef.current = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
    })

    const renderFrame = (index: number, force = false) => {
      const frames = framesRef.current
      const ctx = ctxRef.current
      if (!ctx || frames.length === 0) return

      const clamped = Math.max(0, Math.min(FRAME_COUNT - 1, index))
      if (!force && clamped === frameRef.current) return

      const frame = frames[clamped]
      if (!frame) return

      const metrics = getCanvasMetrics(canvas)
      if (!metrics) return

      frameRef.current = clamped
      drawCover(ctx, frame, metrics.pixelWidth, metrics.pixelHeight)
    }

    const scheduleFrame = (index: number) => {
      pendingFrameRef.current = index
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0
        renderFrame(pendingFrameRef.current)
      })
    }

    const setupScroll = () => {
      if (cancelled) return

      triggerRef.current?.kill()
      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        pin,
        pinSpacing: true,
        scrub: true,
        anticipatePin: 0,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress
          scheduleFrame(Math.round(progress * (FRAME_COUNT - 1)))
          setScrollProgress(progress)

          // Hold the intro hint briefly, then map remaining progress across sections.
          const storyProgress = Math.max(0, (progress - 0.06) / 0.94)
          const nextSection = Math.min(
            SECTION_COUNT - 1,
            Math.floor(storyProgress * SECTION_COUNT),
          )
          if (sectionIndexRef.current !== nextSection) {
            sectionIndexRef.current = nextSection
            setSectionIndex(nextSection)
          }
        },
        onLeave: () => {
          pin.style.visibility = 'hidden'
        },
        onEnterBack: () => {
          pin.style.visibility = 'visible'
        },
      })

      frameRef.current = -1
      renderFrame(0, true)
      setStatus('ready')
      ScrollTrigger.refresh()
    }

    const preloadFrames = async () => {
      const frames: FrameSource[] = new Array(FRAME_COUNT)
      let loaded = 0
      let lastProgress = -1

      try {
        const batchSize = 16
        for (let start = 0; start < FRAME_COUNT; start += batchSize) {
          const batch = Array.from(
            { length: Math.min(batchSize, FRAME_COUNT - start) },
            async (_, offset) => {
              const index = start + offset
              frames[index] = await loadFrame(index)
              loaded += 1
              const nextProgress = Math.round((loaded / FRAME_COUNT) * 100)
              if (!cancelled && nextProgress !== lastProgress && nextProgress % 5 === 0) {
                lastProgress = nextProgress
                setLoadProgress(nextProgress)
              }
            },
          )
          await Promise.all(batch)
          if (cancelled) return
        }

        framesRef.current = frames
        setupScroll()
      } catch {
        if (!cancelled) setStatus('error')
      }
    }

    const onResize = () => {
      const index = triggerRef.current
        ? Math.round(triggerRef.current.progress * (FRAME_COUNT - 1))
        : Math.max(0, frameRef.current)
      frameRef.current = -1
      renderFrame(index, true)
      ScrollTrigger.refresh()
    }

    resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(pin)
    window.addEventListener('resize', onResize)

    void preloadFrames()

    return () => {
      cancelled = true
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      triggerRef.current?.kill()
      resizeObserver?.disconnect()
      window.removeEventListener('resize', onResize)
      framesRef.current.forEach((frame) => {
        if (typeof ImageBitmap !== 'undefined' && frame instanceof ImageBitmap) {
          frame.close()
        }
      })
      framesRef.current = []
    }
  }, [])

  const active = SECTIONS[sectionIndex]
  const alignLeft = sectionIndex % 2 === 0
  const showHint = status === 'ready' && scrollProgress < 0.08
  const showCopy = status === 'ready' && scrollProgress >= 0.05

  const storyProgress = Math.max(0, (scrollProgress - 0.06) / 0.94)
  const localProgress = storyProgress * SECTION_COUNT - sectionIndex
  const copyY = (0.5 - localProgress) * 28

  return (
    <section
      ref={sectionRef}
      aria-label="Scroll to explore Nebuloid capabilities"
      className="theme-preserve-dark relative z-0"
      style={{ height: `${SCROLL_VH}vh` }}
    >
      <div ref={pinRef} className="relative z-0 h-screen w-full overflow-hidden bg-[#090909]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full scale-[1.04] transform-gpu will-change-transform"
          aria-hidden={status !== 'ready'}
        />

        {/* Soft vignette — keeps the visual dominant while lifting text */}
        <div
          className={cn(
            'pointer-events-none absolute inset-0 transition-opacity duration-700',
            alignLeft
              ? 'bg-gradient-to-r from-[#090909]/85 via-[#090909]/35 to-transparent'
              : 'bg-gradient-to-l from-[#090909]/85 via-[#090909]/35 to-transparent',
          )}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#090909]/45 via-transparent to-[#090909]/55" />

        {status === 'loading' && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#090909]/85">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#d4af37]/25 border-t-[#d4af37]" />
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#F1E9DB]/60">
              Preparing experience
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d4af37]/80">
              {loadProgress}%
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#090909]/90 px-6 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
              Sequence unavailable
            </p>
            <p className="max-w-sm text-sm text-[#F1E9DB]/55">
              Scroll continues normally. Refresh to retry loading the animation frames.
            </p>
          </div>
        )}

        <ScrollHint visible={showHint} />

        {showCopy && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-end pb-24 pt-24 sm:items-center sm:pb-0 sm:pt-0">
            <div className="content-grid w-full px-6 md:px-10 lg:px-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.title}
                  initial={{
                    opacity: 0,
                    y: 36,
                    x: alignLeft ? -24 : 24,
                    filter: 'blur(10px)',
                  }}
                  animate={{
                    opacity: 1,
                    y: copyY,
                    x: 0,
                    filter: 'blur(0px)',
                  }}
                  exit={{
                    opacity: 0,
                    y: -28,
                    x: alignLeft ? -16 : 16,
                    filter: 'blur(8px)',
                  }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    'relative max-w-xl',
                    // Keep copy left-aligned on small screens for readability.
                    'text-left md:max-w-xl',
                    alignLeft ? 'mr-auto md:text-left' : 'mr-auto md:ml-auto md:text-right',
                  )}
                >
                  <div
                    className={cn(
                      'absolute -inset-x-4 -inset-y-6 -z-10 rounded-[2rem] blur-2xl sm:-inset-x-6 sm:-inset-y-8',
                      alignLeft
                        ? 'bg-gradient-to-r from-black/75 via-black/40 to-transparent'
                        : 'bg-gradient-to-r from-black/75 via-black/40 to-transparent md:bg-gradient-to-l',
                    )}
                  />

                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#d4af37]">
                    {String(sectionIndex + 1).padStart(2, '0')} /{' '}
                    {String(SECTION_COUNT).padStart(2, '0')}
                  </p>
                  <h2 className="mt-3 text-[clamp(1.85rem,8vw,4.75rem)] font-bold leading-[0.95] tracking-[-0.03em] text-[#F1E9DB] sm:mt-4">
                    {active.title}
                  </h2>
                  <p
                    className={cn(
                      'mt-4 max-w-md text-sm leading-relaxed text-[#F1E9DB]/72 sm:mt-6 sm:text-base md:text-lg',
                      !alignLeft && 'md:ml-auto',
                    )}
                  >
                    {active.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {status === 'ready' && (
          <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex justify-center gap-1.5 px-6 sm:bottom-6">
            {SECTIONS.map((item, index) => (
              <span
                key={item.title}
                className={cn(
                  'h-1 rounded-full transition-all duration-500',
                  index === sectionIndex
                    ? 'w-6 bg-[#d4af37] sm:w-8'
                    : 'w-1.5 bg-[#F1E9DB]/25 sm:w-2',
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
