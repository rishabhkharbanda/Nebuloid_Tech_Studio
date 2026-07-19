'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'

const SCROLL_VH = 280
const VIDEO_SRC = '/assets/videos/experience-scroll.mp4'

export function AppleScrollSequence() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const section = sectionRef.current
    const pin = pinRef.current
    const video = videoRef.current
    if (!section || !pin || !video) return

    let cancelled = false

    const setup = async () => {
      try {
        video.src = VIDEO_SRC
        video.muted = true
        video.playsInline = true
        video.preload = 'auto'
        video.pause()

        await new Promise<void>((resolve, reject) => {
          const onReady = () => {
            cleanup()
            resolve()
          }
          const onError = () => {
            cleanup()
            reject(new Error('Failed to load scroll video'))
          }
          const cleanup = () => {
            video.removeEventListener('loadedmetadata', onReady)
            video.removeEventListener('canplay', onReady)
            video.removeEventListener('error', onError)
          }

          if (video.readyState >= 1) {
            resolve()
            return
          }

          video.addEventListener('loadedmetadata', onReady)
          video.addEventListener('canplay', onReady)
          video.addEventListener('error', onError)
          video.load()
        })

        if (cancelled) return

        const duration = Math.max(0.1, video.duration || 1)
        setStatus('ready')

        triggerRef.current = ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          pin,
          pinSpacing: true,
          anticipatePin: 0,
          scrub: 0.35,
          onUpdate: (self) => {
            const nextTime = self.progress * duration
            if (Math.abs(video.currentTime - nextTime) > 0.04) {
              video.currentTime = nextTime
            }
          },
          onLeave: () => {
            pin.style.visibility = 'hidden'
          },
          onEnterBack: () => {
            pin.style.visibility = 'visible'
          },
        })

        ScrollTrigger.refresh()
      } catch {
        if (!cancelled) setStatus('error')
      }
    }

    void setup()

    return () => {
      cancelled = true
      triggerRef.current?.kill()
      triggerRef.current = null
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
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          preload="auto"
          aria-hidden={status !== 'ready'}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#090909]/35 via-transparent to-[#090909]/50" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,#090909_100%)] opacity-70" />

        {status === 'loading' && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#090909]/85">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#d4af37]/25 border-t-[#d4af37]" />
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#F1E9DB]/60">
              Loading sequence
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#090909]/9 px-6 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#F1E9DB]/60">
              Experience preview unavailable
            </p>
          </div>
        )}

        {status === 'ready' && (
          <div className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#F1E9DB]/55">
              Scroll to explore
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
