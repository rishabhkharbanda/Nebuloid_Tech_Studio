'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'

const FRAME_COUNT = 240
const SCROLL_VH = 280
const FRAME_BASE = '/assets/scroll-sequence/ezgif-frame-'
const MAX_DPR = 2

function frameSrc(index: number) {
  return `${FRAME_BASE}${String(index + 1).padStart(3, '0')}.jpg`
}

type CanvasMetrics = {
  pixelWidth: number
  pixelHeight: number
}

function getCanvasMetrics(canvas: HTMLCanvasElement): CanvasMetrics | null {
  const parent = canvas.parentElement
  if (!parent) return null

  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
  const cssWidth = parent.clientWidth
  const cssHeight = parent.clientHeight
  const pixelWidth = Math.max(1, Math.round(cssWidth * dpr))
  const pixelHeight = Math.max(1, Math.round(cssHeight * dpr))

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
  image: HTMLImageElement,
  pixelWidth: number,
  pixelHeight: number,
) {
  const imgRatio = image.naturalWidth / image.naturalHeight
  const canvasRatio = pixelWidth / pixelHeight

  let drawWidth: number
  let drawHeight: number
  let offsetX: number
  let offsetY: number

  if (imgRatio > canvasRatio) {
    drawHeight = pixelHeight
    drawWidth = Math.round(image.naturalWidth * (pixelHeight / image.naturalHeight))
    offsetX = Math.round((pixelWidth - drawWidth) / 2)
    offsetY = 0
  } else {
    drawWidth = pixelWidth
    drawHeight = Math.round(image.naturalHeight * (pixelWidth / image.naturalWidth))
    offsetX = 0
    offsetY = Math.round((pixelHeight - drawHeight) / 2)
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.clearRect(0, 0, pixelWidth, pixelHeight)
  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)
}

export function AppleScrollSequence() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const frameRef = useRef(-1)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const pendingFrameRef = useRef(0)
  const rafRef = useRef(0)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const section = sectionRef.current
    const pin = pinRef.current
    const canvas = canvasRef.current
    if (!section || !pin || !canvas) return

    let cancelled = false
    let resizeObserver: ResizeObserver | null = null

    const renderFrame = (index: number, force = false) => {
      const images = imagesRef.current
      const ctx = canvas.getContext('2d', { alpha: false })
      if (!ctx || images.length === 0) return

      const clamped = Math.max(0, Math.min(FRAME_COUNT - 1, index))
      if (!force && clamped === frameRef.current) return

      const image = images[clamped]
      if (!image?.complete) return

      const metrics = getCanvasMetrics(canvas)
      if (!metrics) return

      frameRef.current = clamped
      drawCover(ctx, image, metrics.pixelWidth, metrics.pixelHeight)
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
        end: `+=${SCROLL_VH}%`,
        pin: pin,
        pinSpacing: true,
        scrub: true,
        anticipatePin: 0,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const index = Math.round(self.progress * (FRAME_COUNT - 1))
          scheduleFrame(index)
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
      const images: HTMLImageElement[] = new Array(FRAME_COUNT)
      let loaded = 0

      const loadImage = (index: number) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image()
          img.decoding = 'async'
          img.onload = () => {
            images[index] = img
            loaded += 1
            if (!cancelled) setProgress(Math.round((loaded / FRAME_COUNT) * 100))
            resolve()
          }
          img.onerror = () => reject(new Error(`Failed to load frame ${index + 1}`))
          img.src = frameSrc(index)
        })

      try {
        const batchSize = 24
        for (let start = 0; start < FRAME_COUNT; start += batchSize) {
          const batch = Array.from(
            { length: Math.min(batchSize, FRAME_COUNT - start) },
            (_, offset) => loadImage(start + offset),
          )
          await Promise.all(batch)
          if (cancelled) return
        }

        imagesRef.current = images
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
          className="absolute inset-0 h-full w-full transform-gpu"
          aria-hidden={status !== 'ready'}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#090909]/45 via-transparent to-[#090909]/55" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,#090909_100%)] opacity-80" />

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
              Scroll to explore
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
