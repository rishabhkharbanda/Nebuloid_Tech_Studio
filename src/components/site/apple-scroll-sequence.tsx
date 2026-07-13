'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'

const FRAME_COUNT = 240
const SCROLL_VH = 280
const FRAME_BASE = '/assets/scroll-sequence/ezgif-frame-'

function frameSrc(index: number) {
  return `${FRAME_BASE}${String(index + 1).padStart(3, '0')}.jpg`
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  const imgRatio = image.naturalWidth / image.naturalHeight
  const canvasRatio = width / height

  let drawWidth: number
  let drawHeight: number
  let offsetX: number
  let offsetY: number

  if (imgRatio > canvasRatio) {
    drawHeight = height
    drawWidth = image.naturalWidth * (height / image.naturalHeight)
    offsetX = (width - drawWidth) / 2
    offsetY = 0
  } else {
    drawWidth = width
    drawHeight = image.naturalHeight * (width / image.naturalWidth)
    offsetX = 0
    offsetY = (height - drawHeight) / 2
  }

  ctx.clearRect(0, 0, width, height)
  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)
}

function resizeCanvas(canvas: HTMLCanvasElement) {
  const parent = canvas.parentElement
  if (!parent) return { width: 0, height: 0, dpr: 1 }

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const width = parent.clientWidth
  const height = parent.clientHeight

  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  const ctx = canvas.getContext('2d')
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  return { width, height, dpr }
}

export function AppleScrollSequence() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const frameRef = useRef(0)
  const triggerRef = useRef<ScrollTrigger | null>(null)
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

    const renderFrame = (index: number) => {
      const images = imagesRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx || images.length === 0) return

      const clamped = Math.max(0, Math.min(FRAME_COUNT - 1, index))
      if (clamped === frameRef.current) return

      const image = images[clamped]
      if (!image?.complete) return

      frameRef.current = clamped
      const { width, height } = resizeCanvas(canvas)
      if (width > 0 && height > 0) drawCover(ctx, image, width, height)
    }

    const setupScroll = () => {
      if (cancelled) return

      triggerRef.current?.kill()
      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${SCROLL_VH}%`,
        pin: pin,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const index = Math.round(self.progress * (FRAME_COUNT - 1))
          renderFrame(index)
        },
      })

      renderFrame(0)
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
      renderFrame(frameRef.current)
      ScrollTrigger.refresh()
    }

    resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(pin)
    window.addEventListener('resize', onResize)

    void preloadFrames()

    return () => {
      cancelled = true
      triggerRef.current?.kill()
      resizeObserver?.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Scroll-driven experience preview"
      className="relative z-0"
      style={{ height: `${SCROLL_VH}vh` }}
    >
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden bg-[#090909]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden={status !== 'ready'}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#090909]/70 via-[#090909]/20 to-[#090909]/90" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,#090909_100%)]" />

        {status === 'loading' && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#090909]/85 backdrop-blur-sm">
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
