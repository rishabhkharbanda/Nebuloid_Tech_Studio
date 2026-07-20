'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'
import { scrollExploreSections } from '@/lib/site-data'
import { cn } from '@/lib/utils'

/** Compressed lite sequence — every 3rd original frame, ~960px wide. */
const FRAME_COUNT = 100
const SCROLL_VH = 220
const FRAME_BASE = '/assets/scroll-sequence-lite/frame-'
const MAX_CANVAS_WIDTH_DESKTOP = 1100
const MAX_CANVAS_WIDTH_MOBILE = 720
const READY_AFTER = 16
const SECTIONS = scrollExploreSections
const SECTION_COUNT = SECTIONS.length

function frameSrc(index: number) {
  return `${FRAME_BASE}${String(index + 1).padStart(3, '0')}.jpg`
}

type FrameSource = HTMLImageElement | ImageBitmap

function prefersLiteMode() {
  if (typeof window === 'undefined') return false
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    ?.saveData
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return Boolean(saveData || reducedMotion)
}

function getCanvasMetrics(canvas: HTMLCanvasElement) {
  const parent = canvas.parentElement
  if (!parent) return null

  const cssWidth = parent.clientWidth
  const cssHeight = parent.clientHeight
  if (cssWidth <= 0 || cssHeight <= 0) return null

  const maxWidth = cssWidth < 768 ? MAX_CANVAS_WIDTH_MOBILE : MAX_CANVAS_WIDTH_DESKTOP
  const dpr = Math.min(window.devicePixelRatio || 1, cssWidth > 900 ? 1.25 : 1)
  const pixelWidth = Math.max(1, Math.min(maxWidth, Math.round(cssWidth * dpr)))
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
  ctx.imageSmoothingQuality = 'low'
  ctx.clearRect(0, 0, pixelWidth, pixelHeight)
  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)
}

async function loadFrame(index: number): Promise<FrameSource> {
  const src = frameSrc(index)

  if (typeof createImageBitmap === 'function') {
    const response = await fetch(src, { priority: 'low' } as RequestInit)
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

function nearestLoadedFrame(frames: Array<FrameSource | undefined>, index: number) {
  if (frames[index]) return frames[index]
  for (let distance = 1; distance < FRAME_COUNT; distance += 1) {
    const before = frames[index - distance]
    if (before) return before
    const after = frames[index + distance]
    if (after) return after
  }
  return undefined
}

/** Evenly spaced indices first so scrubbing works early. */
function buildLoadOrder(total: number) {
  const order: number[] = []
  const seen = new Set<number>()
  const push = (index: number) => {
    const clamped = Math.max(0, Math.min(total - 1, index))
    if (seen.has(clamped)) return
    seen.add(clamped)
    order.push(clamped)
  }

  push(0)
  push(total - 1)
  for (let step = Math.floor(total / 4); step >= 1; step = Math.floor(step / 2)) {
    for (let i = step; i < total; i += step) push(i)
    if (step === 1) break
  }
  for (let i = 0; i < total; i += 1) push(i)
  return order
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
  const framesRef = useRef<Array<FrameSource | undefined>>([])
  const frameRef = useRef(-1)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const pendingFrameRef = useRef(0)
  const rafRef = useRef(0)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const sectionIndexRef = useRef(0)
  const startedRef = useRef(false)

  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'static' | 'error'>('idle')
  const [loadProgress, setLoadProgress] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [sectionIndex, setSectionIndex] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    const sync = () => setIsDesktop(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const section = sectionRef.current
    const pin = pinRef.current
    const canvas = canvasRef.current
    if (!section || !pin || !canvas) return

    let cancelled = false
    let resizeObserver: ResizeObserver | null = null
    let intersectionObserver: IntersectionObserver | null = null
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

      const frame = nearestLoadedFrame(frames, clamped)
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
      if (cancelled || triggerRef.current) return

      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        pin,
        pinSpacing: true,
        scrub: 0.35,
        anticipatePin: 0,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress
          scheduleFrame(Math.round(progress * (FRAME_COUNT - 1)))
          setScrollProgress(progress)

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
          pin.style.pointerEvents = 'none'
        },
        onEnterBack: () => {
          pin.style.visibility = 'visible'
          pin.style.pointerEvents = 'auto'
        },
      })

      frameRef.current = -1
      renderFrame(0, true)
      setStatus('ready')
      ScrollTrigger.refresh()
    }

    const preloadFrames = async () => {
      if (cancelled || startedRef.current) return
      startedRef.current = true

      if (prefersLiteMode()) {
        try {
          const first = await loadFrame(0)
          framesRef.current = [first]
          const metrics = getCanvasMetrics(canvas)
          const ctx = ctxRef.current
          if (ctx && metrics) drawCover(ctx, first, metrics.pixelWidth, metrics.pixelHeight)
          setStatus('static')
          setLoadProgress(100)
        } catch {
          if (!cancelled) setStatus('error')
        }
        return
      }

      setStatus('loading')
      const frames: Array<FrameSource | undefined> = new Array(FRAME_COUNT)
      framesRef.current = frames
      const order = buildLoadOrder(FRAME_COUNT)
      let loaded = 0
      let lastProgress = -1
      let becameReady = false

      try {
        const batchSize = 8
        for (let start = 0; start < order.length; start += batchSize) {
          if (cancelled) return

          const batch = order.slice(start, start + batchSize)
          await Promise.all(
            batch.map(async (index) => {
              if (frames[index]) return
              frames[index] = await loadFrame(index)
              loaded += 1
              const nextProgress = Math.round((loaded / FRAME_COUNT) * 100)
              if (!cancelled && nextProgress !== lastProgress) {
                lastProgress = nextProgress
                setLoadProgress(nextProgress)
              }
            }),
          )

          if (!becameReady && loaded >= READY_AFTER) {
            becameReady = true
            setupScroll()
          } else if (becameReady) {
            const current = triggerRef.current
              ? Math.round(triggerRef.current.progress * (FRAME_COUNT - 1))
              : 0
            frameRef.current = -1
            renderFrame(current, true)
          }
        }

        if (!becameReady) setupScroll()
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

    intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          intersectionObserver?.disconnect()
          void preloadFrames()
        }
      },
      { rootMargin: '200% 0px', threshold: 0.01 },
    )
    intersectionObserver.observe(section)

    return () => {
      cancelled = true
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      triggerRef.current?.kill()
      resizeObserver?.disconnect()
      intersectionObserver?.disconnect()
      window.removeEventListener('resize', onResize)
      framesRef.current.forEach((frame) => {
        if (frame && typeof ImageBitmap !== 'undefined' && frame instanceof ImageBitmap) {
          frame.close()
        }
      })
      framesRef.current = []
    }
  }, [])

  const active = SECTIONS[sectionIndex]
  const alignLeft = sectionIndex % 2 === 0
  const showHint = status === 'ready' && scrollProgress < 0.08
  const showCopy = (status === 'ready' || status === 'static') && scrollProgress >= 0.05

  const storyProgress = Math.max(0, (scrollProgress - 0.06) / 0.94)
  const localProgress = storyProgress * SECTION_COUNT - sectionIndex
  const copyY = (0.5 - localProgress) * 28
  const copyX = isDesktop ? (alignLeft ? -24 : 24) : 0
  const exitX = isDesktop ? (alignLeft ? -16 : 16) : 0

  return (
    <section
      ref={sectionRef}
      aria-label="Scroll to explore Nebuloid capabilities"
      className="theme-preserve-dark relative z-0"
      style={{ height: status === 'static' ? '100vh' : `${SCROLL_VH}vh` }}
    >
      <div ref={pinRef} className="relative z-0 h-screen w-full overflow-hidden bg-[#090909]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full scale-[1.02] transform-gpu will-change-transform"
          aria-hidden={status !== 'ready' && status !== 'static'}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#090909]/55 via-[#090909]/20 to-[#090909]/55 md:hidden" />
        <div
          className={cn(
            'pointer-events-none absolute inset-0 hidden transition-opacity duration-700 md:block',
            alignLeft
              ? 'bg-gradient-to-r from-[#090909]/85 via-[#090909]/35 to-transparent'
              : 'bg-gradient-to-l from-[#090909]/85 via-[#090909]/35 to-transparent',
          )}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#090909]/45 via-transparent to-[#090909]/55" />

        {(status === 'idle' || status === 'loading') && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#090909]/70">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#d4af37]/25 border-t-[#d4af37]" />
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#F1E9DB]/60">
              Preparing experience
            </p>
            {status === 'loading' && (
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d4af37]/80">
                {loadProgress}%
              </p>
            )}
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

        {showCopy && status === 'ready' && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center">
            <div className="content-grid w-full px-6 md:px-10 lg:px-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.title}
                  initial={{
                    opacity: 0,
                    y: 36,
                    x: copyX,
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
                    x: exitX,
                    filter: 'blur(8px)',
                  }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    'relative mx-auto max-w-xl text-center',
                    alignLeft
                      ? 'md:mx-0 md:mr-auto md:text-left'
                      : 'md:mx-0 md:ml-auto md:text-right',
                  )}
                >
                  <div
                    className={cn(
                      'absolute -inset-x-4 -inset-y-6 -z-10 rounded-[2rem] blur-2xl sm:-inset-x-6 sm:-inset-y-8',
                      'bg-gradient-to-b from-black/55 via-black/40 to-transparent',
                      alignLeft
                        ? 'md:bg-gradient-to-r md:from-black/75 md:via-black/40 md:to-transparent'
                        : 'md:bg-gradient-to-l md:from-black/75 md:via-black/40 md:to-transparent',
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
                      'mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#F1E9DB]/72 sm:mt-6 sm:text-base md:text-lg',
                      alignLeft ? 'md:mx-0' : 'md:ml-auto md:mr-0',
                    )}
                  >
                    {active.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {status === 'static' && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center">
            <div className="content-grid w-full px-6 text-center md:px-10 md:text-left lg:px-16">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#d4af37]">
                Explore
              </p>
              <h2 className="mt-3 text-[clamp(1.85rem,8vw,4.75rem)] font-bold leading-[0.95] tracking-[-0.03em] text-[#F1E9DB]">
                {SECTIONS[0]?.title}
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#F1E9DB]/72 md:mx-0 md:text-base">
                {SECTIONS[0]?.description}
              </p>
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
