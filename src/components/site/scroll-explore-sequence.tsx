'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'
import { scrollExploreSections } from '@/lib/site-data'
import { cn } from '@/lib/utils'

/** Ultra-compressed sequence — 50 frames @ ~720px. */
const FRAME_COUNT = 50
const SCROLL_VH = 180
const FRAME_BASE = '/assets/scroll-sequence-ultra/frame-'
const POSTER_SRC = `${FRAME_BASE}001.jpg`
const MAX_CANVAS_WIDTH_DESKTOP = 900
const MAX_CANVAS_WIDTH_MOBILE = 640
const SECTIONS = scrollExploreSections
const SECTION_COUNT = SECTIONS.length

function frameSrc(index: number) {
  return `${FRAME_BASE}${String(index + 1).padStart(3, '0')}.jpg`
}

type FrameSource = HTMLImageElement

function shouldUseStaticSequence() {
  if (typeof window === 'undefined') return true
  const finePointer = window.matchMedia('(pointer: fine)').matches
  const wide = window.matchMedia('(min-width: 900px)').matches
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    ?.saveData
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const cores = navigator.hardwareConcurrency || 8
  return !finePointer || !wide || Boolean(saveData || reducedMotion || cores <= 2)
}

function getCanvasMetrics(canvas: HTMLCanvasElement) {
  const parent = canvas.parentElement
  if (!parent) return null

  const cssWidth = parent.clientWidth
  const cssHeight = parent.clientHeight
  if (cssWidth <= 0 || cssHeight <= 0) return null

  const maxWidth = cssWidth < 768 ? MAX_CANVAS_WIDTH_MOBILE : MAX_CANVAS_WIDTH_DESKTOP
  const dpr = Math.min(window.devicePixelRatio || 1, 1.15)
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
  const sourceWidth = image.naturalWidth || image.width
  const sourceHeight = image.naturalHeight || image.height
  if (!sourceWidth || !sourceHeight) return

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

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load ${src}`))
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
  for (let step = Math.floor(total / 3); step >= 1; step = Math.floor(step / 2)) {
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
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
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

  const [status, setStatus] = useState<'boot' | 'ready' | 'static' | 'error'>('boot')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [sectionIndex, setSectionIndex] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)
  const [showPoster, setShowPoster] = useState(true)

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
      if (!ctx) return

      const clamped = Math.max(0, Math.min(FRAME_COUNT - 1, index))
      if (!force && clamped === frameRef.current) return

      const frame = nearestLoadedFrame(frames, clamped)
      if (!frame) return

      const metrics = getCanvasMetrics(canvas)
      if (!metrics) return

      frameRef.current = clamped
      drawCover(ctx, frame, metrics.pixelWidth, metrics.pixelHeight)
      setShowPoster(false)
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
        scrub: 0.25,
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

    const startSequence = async () => {
      if (cancelled || startedRef.current) return
      startedRef.current = true

      try {
        // Instant first paint — never block the page on a full preload.
        const first = await loadImage(POSTER_SRC)
        framesRef.current = new Array(FRAME_COUNT)
        framesRef.current[0] = first
        renderFrame(0, true)

        if (shouldUseStaticSequence()) {
          setStatus('static')
          return
        }

        setupScroll()

        const order = buildLoadOrder(FRAME_COUNT).filter((index) => index !== 0)
        const batchSize = 6
        for (let start = 0; start < order.length; start += batchSize) {
          if (cancelled) return
          const batch = order.slice(start, start + batchSize)
          await Promise.all(
            batch.map(async (index) => {
              if (framesRef.current[index]) return
              framesRef.current[index] = await loadImage(frameSrc(index))
            }),
          )
          const current = triggerRef.current
            ? Math.round(triggerRef.current.progress * (FRAME_COUNT - 1))
            : 0
          frameRef.current = -1
          renderFrame(current, true)
        }
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

    // Start as soon as the section is near — but poster is already visible via <img>.
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          intersectionObserver?.disconnect()
          void startSequence()
        }
      },
      { rootMargin: '120% 0px', threshold: 0 },
    )
    intersectionObserver.observe(section)

    return () => {
      cancelled = true
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      triggerRef.current?.kill()
      resizeObserver?.disconnect()
      intersectionObserver?.disconnect()
      window.removeEventListener('resize', onResize)
      framesRef.current = []
    }
  }, [])

  const active = SECTIONS[sectionIndex]
  const alignLeft = sectionIndex % 2 === 0
  const interactive = status === 'ready'
  const showHint = interactive && scrollProgress < 0.08
  const showCopy = interactive && scrollProgress >= 0.05

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
      style={{ height: status === 'ready' ? `${SCROLL_VH}vh` : '100vh' }}
    >
      <div ref={pinRef} className="relative z-0 h-screen w-full overflow-hidden bg-[#090909]">
        {showPoster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={POSTER_SRC}
            alt=""
            aria-hidden
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <canvas
          ref={canvasRef}
          className={cn(
            'absolute inset-0 h-full w-full scale-[1.02] transform-gpu will-change-transform',
            showPoster ? 'opacity-0' : 'opacity-100',
          )}
          aria-hidden
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

        {(showCopy || status === 'static' || status === 'boot') && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center">
            <div className="content-grid w-full px-6 md:px-10 lg:px-16">
              {interactive ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.title}
                    initial={{
                      opacity: 0,
                      y: 36,
                      x: copyX,
                      filter: 'blur(8px)',
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
                      filter: 'blur(6px)',
                    }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      'relative mx-auto max-w-xl text-center',
                      alignLeft
                        ? 'md:mx-0 md:mr-auto md:text-left'
                        : 'md:mx-0 md:ml-auto md:text-right',
                    )}
                  >
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
              ) : (
                <div className="relative mx-auto max-w-xl text-center md:mx-0 md:text-left">
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
              )}
            </div>
          </div>
        )}

        {interactive && (
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
