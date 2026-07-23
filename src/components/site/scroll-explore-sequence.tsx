'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'
import { scrollExploreSections } from '@/lib/site-data'
import { cn } from '@/lib/utils'

/** Extra scroll distance while the viewport stays pinned (beyond 100vh). */
const SCROLL_DISTANCE_VH = 140
const TOTAL_SCROLL_VH = 100 + SCROLL_DISTANCE_VH
const VIDEO_SRC = '/assets/scroll-explore.mp4'
const POSTER_SRC = '/assets/scroll-explore-poster.jpg'
/** Show 5 beats per visit, drawn from the full 9-capability pool. */
const ACTIVE_SECTION_COUNT = 5

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

function prefersStaticMode() {
  if (typeof window === 'undefined') return false
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    ?.saveData
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return Boolean(saveData || reducedMotion)
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
  const videoRef = useRef<HTMLVideoElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const rafRef = useRef(0)
  const pendingProgressRef = useRef(0)
  const sectionIndexRef = useRef(0)
  const hintVisibleRef = useRef(false)
  const startedRef = useRef(false)
  const durationRef = useRef(0)
  const objectUrlRef = useRef<string | null>(null)

  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'static' | 'error'>('idle')
  const [loadProgress, setLoadProgress] = useState(0)
  const [displaySectionIndex, setDisplaySectionIndex] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [showPoster, setShowPoster] = useState(true)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const section = sectionRef.current
    const pin = pinRef.current
    const video = videoRef.current
    if (!section || !pin || !video) return

    let cancelled = false
    let intersectionObserver: IntersectionObserver | null = null

    const setSectionFromProgress = (progress: number) => {
      const next = Math.min(
        sectionCount - 1,
        Math.max(0, Math.floor(progress * sectionCount)),
      )
      if (next !== sectionIndexRef.current) {
        sectionIndexRef.current = next
        setDisplaySectionIndex(next)
      }
    }

    const setHintVisible = (visible: boolean) => {
      if (visible === hintVisibleRef.current) return
      hintVisibleRef.current = visible
      setShowHint(visible)
    }

    const setPinnedLayer = (active: boolean) => {
      // Keep the pinned frame above following sections so "Trusted By" can't bleed through.
      pin.style.zIndex = active ? '30' : ''
    }

    const scrubToProgress = (progress: number) => {
      const duration = durationRef.current
      if (!duration || !Number.isFinite(duration)) return

      // Leave a tiny epsilon so browsers don't clamp/reject seeks at exact duration.
      const maxTime = Math.max(0, duration - 0.05)
      const target = progress >= 0.999 ? maxTime : Math.min(maxTime, Math.max(0, progress * maxTime))
      if (Math.abs(video.currentTime - target) < 0.01) return

      try {
        video.currentTime = target
      } catch {
        // Some browsers throw while seeking before ready; ignore.
      }
    }

    const flushScrub = () => {
      rafRef.current = 0
      scrubToProgress(pendingProgressRef.current)
    }

    const queueScrub = (progress: number) => {
      pendingProgressRef.current = progress
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(flushScrub)
    }

    const mountTrigger = () => {
      triggerRef.current?.kill()
      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${SCROLL_DISTANCE_VH}vh`,
        pin: pin,
        pinSpacing: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress
          queueScrub(progress)
          setSectionFromProgress(progress)
          setHintVisible(progress < 0.04)
        },
        onEnter: () => {
          setPinnedLayer(true)
          setHintVisible(true)
        },
        onEnterBack: () => {
          setPinnedLayer(true)
          setHintVisible(false)
        },
        onLeave: () => {
          setPinnedLayer(false)
          setHintVisible(false)
          queueScrub(1)
        },
        onLeaveBack: () => {
          setPinnedLayer(false)
          setHintVisible(true)
          queueScrub(0)
        },
      })

      const progress = triggerRef.current.progress
      setPinnedLayer(progress > 0 && progress < 1)
      queueScrub(progress)
      setSectionFromProgress(progress)
      setHintVisible(progress < 0.04)
      ScrollTrigger.refresh()
    }

    const enableStaticMode = () => {
      if (cancelled) return
      setStatus('static')
      setShowPoster(true)
      setShowHint(false)
      setDisplaySectionIndex(0)
      sectionIndexRef.current = 0
    }

    const loadVideoSource = async () => {
      // Blob URL keeps the full file seekable so the scrub doesn't freeze near the end.
      const response = await fetch(VIDEO_SRC, { priority: 'high' } as RequestInit)
      if (!response.ok) throw new Error('Failed to fetch scroll explore video')

      setLoadProgress(35)
      const blob = await response.blob()
      if (cancelled) return

      setLoadProgress(90)
      const url = URL.createObjectURL(blob)
      objectUrlRef.current = url
      video.src = url
    }

    const waitForDecode = () =>
      new Promise<void>((resolve, reject) => {
        const cleanup = () => {
          video.removeEventListener('loadedmetadata', onMeta)
          video.removeEventListener('canplaythrough', onReady)
          video.removeEventListener('error', onError)
        }

        const onMeta = () => {
          durationRef.current = video.duration || 0
          setLoadProgress((prev) => Math.max(prev, 94))
        }

        const onReady = () => {
          durationRef.current = video.duration || durationRef.current
          cleanup()
          resolve()
        }

        const onError = () => {
          cleanup()
          reject(new Error('Failed to decode scroll explore video'))
        }

        video.addEventListener('loadedmetadata', onMeta)
        video.addEventListener('canplaythrough', onReady)
        video.addEventListener('error', onError)

        if (video.readyState >= 4 && video.duration) {
          durationRef.current = video.duration
          cleanup()
          resolve()
          return
        }

        video.load()
      })

    const startSequence = async () => {
      if (cancelled || startedRef.current) return
      startedRef.current = true

      if (prefersStaticMode()) {
        enableStaticMode()
        return
      }

      setStatus('loading')
      setLoadProgress(6)

      try {
        video.muted = true
        video.playsInline = true
        video.preload = 'auto'
        await loadVideoSource()
        if (cancelled) return
        await waitForDecode()
        if (cancelled) return

        // Nudge decode pipeline so the first and last seeks paint immediately.
        try {
          await video.play()
          video.pause()
          video.currentTime = 0
        } catch {
          // Autoplay policies can block play(); seeking still works when muted.
        }

        if (cancelled) return

        setLoadProgress(100)
        setStatus('ready')
        setShowPoster(false)
        mountTrigger()
      } catch {
        if (cancelled) return
        setStatus('error')
        setShowPoster(true)
      }
    }

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
      triggerRef.current = null
      intersectionObserver?.disconnect()
      video.pause()
      pin.style.zIndex = ''
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
      startedRef.current = false
      hintVisibleRef.current = false
    }
  }, [sectionCount])

  const active = sections[displaySectionIndex] ?? sections[0]
  const alignLeft = displaySectionIndex % 2 === 0
  const showCopy = status !== 'error'
  const isBooting = status === 'idle' || status === 'loading'

  return (
    <section
      ref={sectionRef}
      aria-label="Scroll to explore Nebuloid capabilities"
      className="theme-preserve-dark relative z-0"
      style={{ minHeight: `${TOTAL_SCROLL_VH}vh` }}
    >
      <div
        ref={pinRef}
        className="relative h-screen w-full overflow-hidden bg-[#090909]"
      >
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

        <video
          ref={videoRef}
          className={cn(
            'absolute inset-0 h-full w-full scale-[1.02] object-cover transform-gpu will-change-transform',
            showPoster ? 'opacity-0' : 'opacity-100',
          )}
          poster={POSTER_SRC}
          muted
          playsInline
          preload="auto"
          aria-hidden={status !== 'ready'}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#090909]/55 via-[#090909]/20 to-[#090909]/55 md:hidden" />
        <div
          className={cn(
            'pointer-events-none absolute inset-0 hidden transition-opacity duration-500 md:block',
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
              Loading experience
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#090909]/90 px-6 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
              Sequence unavailable
            </p>
            <p className="max-w-sm text-sm text-[#F1E9DB]/55">
              Scroll continues normally. Refresh to retry loading the experience.
            </p>
          </div>
        )}

        <ScrollHint visible={showHint} />

        {showCopy && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center">
            <div className="w-full px-6 md:px-10 lg:px-16">
              <div
                className={cn(
                  'relative mx-auto min-h-[16rem] w-full max-w-xl sm:min-h-[18rem] md:min-h-[20rem]',
                  alignLeft ? 'md:ml-0 md:mr-auto' : 'md:mr-0 md:ml-auto',
                )}
              >
                {status === 'ready' ? (
                  <div className="relative min-h-[16rem] sm:min-h-[18rem] md:min-h-[20rem]">
                    <AnimatePresence mode="sync" initial={false}>
                      <motion.div
                        key={active.title}
                        initial={{ opacity: 0, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, filter: 'blur(6px)' }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                          'absolute inset-0 flex flex-col justify-center text-center',
                          alignLeft ? 'md:text-left' : 'md:text-right',
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
                          {String(displaySectionIndex + 1).padStart(2, '0')} /{' '}
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
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="flex min-h-[16rem] w-full flex-col justify-center text-center sm:min-h-[18rem] md:min-h-[20rem] md:text-left"
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
          </div>
        )}

        {status === 'ready' && (
          <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex justify-center gap-1.5 px-6 sm:bottom-6">
            {sections.map((item, index) => (
              <span
                key={item.title}
                className={cn(
                  'h-1 rounded-full transition-all duration-500 ease-out',
                  index === displaySectionIndex
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
