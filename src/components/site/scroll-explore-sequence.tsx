'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'
import { scrollExploreSections } from '@/lib/site-data'
import { cn } from '@/lib/utils'

/** HD sequence — every 3rd original frame @ 1920×1080, loaded by story-section belts. */
const FRAME_COUNT = 100
const SCROLL_VH = 240
const FRAME_BASE = '/assets/scroll-sequence-hd/frame-'
const POSTER_SRC = `${FRAME_BASE}001.jpg`
const MAX_CANVAS_WIDTH_DESKTOP = 1920
const MAX_CANVAS_WIDTH_MOBILE = 1080
/** Show 5 beats per visit, drawn from the full 9-capability pool. */
const ACTIVE_SECTION_COUNT = 5
const BELT_COUNT = ACTIVE_SECTION_COUNT
const BELT_SIZE = Math.ceil(FRAME_COUNT / BELT_COUNT)

type ExploreSection = (typeof scrollExploreSections)[number]

function pickExploreSections(
  pool: readonly ExploreSection[],
  count: number,
): ExploreSection[] {
  const indices = pool.map((_, index) => index)
  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const swap = indices[i]
    indices[i] = indices[j]
    indices[j] = swap
  }
  return indices
    .slice(0, Math.min(count, pool.length))
    .sort((a, b) => a - b)
    .map((index) => pool[index])
}

function frameSrc(index: number) {
  return `${FRAME_BASE}${String(index + 1).padStart(3, '0')}.jpg`
}

function beltForFrame(index: number) {
  return Math.min(BELT_COUNT - 1, Math.floor(index / BELT_SIZE))
}

function framesInBelt(belt: number) {
  const start = belt * BELT_SIZE
  const end = Math.min(FRAME_COUNT, start + BELT_SIZE)
  const indices: number[] = []
  for (let i = start; i < end; i += 1) indices.push(i)
  return indices
}

type FrameSource = HTMLImageElement | ImageBitmap

function prefersStaticMode() {
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
  const dpr = Math.min(window.devicePixelRatio || 1, cssWidth > 900 ? 1.5 : 1.25)
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
  ctx.imageSmoothingQuality = 'high'
  ctx.clearRect(0, 0, pixelWidth, pixelHeight)
  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)
}

async function loadFrame(index: number, priority: 'high' | 'low' = 'low'): Promise<FrameSource> {
  const src = frameSrc(index)

  if (typeof createImageBitmap === 'function') {
    const response = await fetch(src, { priority } as RequestInit)
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
  const [sections] = useState(() =>
    pickExploreSections(scrollExploreSections, ACTIVE_SECTION_COUNT),
  )
  const sectionCount = sections.length

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
  const posterHiddenRef = useRef(false)
  const readyRef = useRef(false)
  const beltStateRef = useRef<Array<'idle' | 'loading' | 'ready'>>(
    Array.from({ length: BELT_COUNT }, () => 'idle'),
  )
  const ensureBeltRef = useRef<(belt: number) => void>(() => {})

  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'static' | 'error'>('idle')
  const [loadProgress, setLoadProgress] = useState(0)
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
    let loadedCount = 0

    ctxRef.current = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
    })

    const bumpProgress = () => {
      const next = Math.round((loadedCount / FRAME_COUNT) * 100)
      setLoadProgress(next)
    }

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
      if (!posterHiddenRef.current) {
        posterHiddenRef.current = true
        setShowPoster(false)
      }
    }

    const scheduleFrame = (index: number) => {
      pendingFrameRef.current = index
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0
        renderFrame(pendingFrameRef.current)
      })
    }

    const ensureBeltsAround = (belt: number) => {
      ensureBeltRef.current(belt)
      if (belt + 1 < BELT_COUNT) ensureBeltRef.current(belt + 1)
      if (belt + 2 < BELT_COUNT) ensureBeltRef.current(belt + 2)
    }

    const setupScroll = () => {
      if (cancelled || triggerRef.current) return

      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        pin,
        pinSpacing: true,
        scrub: 0.45,
        anticipatePin: 0,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress
          const frameIndex = Math.round(progress * (FRAME_COUNT - 1))
          scheduleFrame(frameIndex)
          setScrollProgress(progress)

          const storyProgress = Math.max(0, progress)
          const nextSection = Math.min(
            sectionCount - 1,
            Math.floor(storyProgress * sectionCount),
          )
          if (sectionIndexRef.current !== nextSection) {
            sectionIndexRef.current = nextSection
            setSectionIndex(nextSection)
          }

          ensureBeltsAround(beltForFrame(frameIndex))
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
      readyRef.current = true
      setStatus('ready')
      ScrollTrigger.refresh()
    }

    const loadBelt = async (belt: number, priority: 'high' | 'low' = 'low') => {
      if (cancelled || belt < 0 || belt >= BELT_COUNT) return
      if (beltStateRef.current[belt] !== 'idle') return

      beltStateRef.current[belt] = 'loading'
      const frames = framesRef.current
      const indices = framesInBelt(belt)
      const batchSize = priority === 'high' ? 4 : 3

      try {
        for (let start = 0; start < indices.length; start += batchSize) {
          if (cancelled) return
          const batch = indices.slice(start, start + batchSize)
          await Promise.all(
            batch.map(async (index) => {
              if (frames[index]) return
              frames[index] = await loadFrame(index, priority)
              loadedCount += 1
              if (!cancelled) bumpProgress()
            }),
          )

          const current = triggerRef.current
            ? Math.round(triggerRef.current.progress * (FRAME_COUNT - 1))
            : Math.max(0, frameRef.current)
          if (beltForFrame(current) === belt || Math.abs(current - indices[0]) < BELT_SIZE) {
            frameRef.current = -1
            renderFrame(current, true)
          }
        }

        if (!cancelled) beltStateRef.current[belt] = 'ready'
      } catch {
        beltStateRef.current[belt] = 'idle'
        throw new Error(`Belt ${belt} failed`)
      }
    }

    ensureBeltRef.current = (belt: number) => {
      void loadBelt(belt, belt <= 1 ? 'high' : 'low').catch(() => {
        if (!cancelled && !readyRef.current) setStatus('error')
      })
    }

    const startSequence = async () => {
      if (cancelled || startedRef.current) return
      startedRef.current = true

      try {
        const first = await loadFrame(0, 'high')
        if (cancelled) return

        if (prefersStaticMode()) {
          framesRef.current = [first]
          renderFrame(0, true)
          setStatus('static')
          setLoadProgress(100)
          return
        }

        setStatus('loading')
        const frames: Array<FrameSource | undefined> = new Array(FRAME_COUNT)
        frames[0] = first
        framesRef.current = frames
        loadedCount = 1
        bumpProgress()
        renderFrame(0, true)

        // First story belt must be complete before scrubbing — then warm the next belts.
        await loadBelt(0, 'high')
        if (cancelled) return
        setupScroll()

        void loadBelt(1, 'high')
        void loadBelt(2, 'low')

        // Idle-fill remaining belts so scrubbing ahead stays smooth.
        const idleFill = () => {
          for (let belt = 3; belt < BELT_COUNT; belt += 1) {
            if (beltStateRef.current[belt] === 'idle') {
              void loadBelt(belt, 'low')
              break
            }
          }
          if (!cancelled && beltStateRef.current.some((state) => state === 'idle')) {
            if (typeof window.requestIdleCallback === 'function') {
              window.requestIdleCallback(idleFill, { timeout: 1200 })
            } else {
              setTimeout(idleFill, 250)
            }
          }
        }
        idleFill()
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
          void startSequence()
        }
      },
      { rootMargin: '180% 0px', threshold: 0.01 },
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
  }, [sectionCount])

  const active = sections[sectionIndex] ?? sections[0]
  const alignLeft = sectionIndex % 2 === 0
  const showHint = status === 'ready' && scrollProgress < 0.06
  const showCopy = status !== 'error'
  const isBooting = status === 'idle' || status === 'loading'

  const storyProgress = Math.max(0, scrollProgress)
  const localProgress = storyProgress * sectionCount - sectionIndex
  const copyY = (0.5 - localProgress) * 24
  const copyX = isDesktop ? (alignLeft ? -18 : 18) : 0
  const exitX = isDesktop ? (alignLeft ? -12 : 12) : 0

  return (
    <section
      ref={sectionRef}
      aria-label="Scroll to explore Nebuloid capabilities"
      className="theme-preserve-dark relative z-0"
      style={{ height: status === 'static' ? '100vh' : `${SCROLL_VH}vh` }}
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

        {isBooting && (
          <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-2">
            <div className="h-0.5 w-28 overflow-hidden rounded-full bg-[#F1E9DB]/15">
              <div
                className="h-full rounded-full bg-[#d4af37] transition-[width] duration-300 ease-out"
                style={{ width: `${Math.max(8, loadProgress)}%` }}
              />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#F1E9DB]/45">
              Loading HD sequence
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
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center">
            <div className="content-grid w-full px-6 md:px-10 lg:px-16">
              {status === 'ready' ? (
                <AnimatePresence mode="sync" initial={false}>
                  <motion.div
                    key={active.title}
                    initial={{
                      opacity: 0,
                      y: 28,
                      x: copyX,
                      filter: 'blur(6px)',
                    }}
                    animate={{
                      opacity: 1,
                      y: copyY,
                      x: 0,
                      filter: 'blur(0px)',
                    }}
                    exit={{
                      opacity: 0,
                      y: -22,
                      x: exitX,
                      filter: 'blur(4px)',
                    }}
                    transition={{
                      opacity: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                      y: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                      x: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                      filter: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                    }}
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
                      {String(sectionCount).padStart(2, '0')}
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
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    'relative mx-auto max-w-xl text-center',
                    'md:mx-0 md:mr-auto md:text-left',
                  )}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#d4af37]">
                    01 / {String(sectionCount).padStart(2, '0')}
                  </p>
                  <h2 className="mt-3 text-[clamp(1.85rem,8vw,4.75rem)] font-bold leading-[0.95] tracking-[-0.03em] text-[#F1E9DB] sm:mt-4">
                    {sections[0]?.title}
                  </h2>
                  <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#F1E9DB]/72 sm:mt-6 sm:text-base md:mx-0 md:text-lg">
                    {sections[0]?.description}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {status === 'ready' && (
          <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex justify-center gap-1.5 px-6 sm:bottom-6">
            {sections.map((item, index) => (
              <span
                key={item.title}
                className={cn(
                  'h-1 rounded-full transition-all duration-500 ease-out',
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
