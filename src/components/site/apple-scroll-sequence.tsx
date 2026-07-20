'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'

const FRAME_COUNT = 300
const SCROLL_VH = 240
const FRAME_BASE = '/assets/scroll-sequence-web/ezgif-frame-'
const MAX_CANVAS_WIDTH = 1600

const SCROLL_CAPTIONS = [
  'Scroll to explore',
  'Discover emotion in motion',
  'Touch the interactive story',
  'Step into immersive worlds',
  'Experience, then share',
  'Ready to begin your journey',
] as const

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

export function AppleScrollSequence() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const framesRef = useRef<FrameSource[]>([])
  const frameRef = useRef(-1)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const pendingFrameRef = useRef(0)
  const rafRef = useRef(0)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [progress, setProgress] = useState(0)
  const [captionIndex, setCaptionIndex] = useState(0)
  const captionIndexRef = useRef(0)

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
          const nextFrame = Math.round(self.progress * (FRAME_COUNT - 1))
          scheduleFrame(nextFrame)

          const nextCaption = Math.min(
            SCROLL_CAPTIONS.length - 1,
            Math.floor(self.progress * SCROLL_CAPTIONS.length),
          )
          if (captionIndexRef.current !== nextCaption) {
            captionIndexRef.current = nextCaption
            setCaptionIndex(nextCaption)
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
                setProgress(nextProgress)
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

  return (
    <section
      ref={sectionRef}
      aria-label="Scroll-driven experience preview"
      className="theme-preserve-dark relative z-0"
      style={{ height: `${SCROLL_VH}vh` }}
    >
      <div ref={pinRef} className="relative z-0 h-screen w-full overflow-hidden bg-[#090909]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full transform-gpu will-change-transform"
          aria-hidden={status !== 'ready'}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#090909]/40 via-transparent to-[#090909]/50" />

        {status === 'loading' && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#090909]/85">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#d4af37]/25 border-t-[#d4af37]" />
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#F1E9DB]/60">
              Loading sequence
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d4af37]/80">
              {progress}%
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

        {status === 'ready' && (
          <div className="pointer-events-none absolute inset-x-0 bottom-10 z-10 flex justify-center px-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#F1E9DB]/40">
              {SCROLL_CAPTIONS[captionIndex]}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
