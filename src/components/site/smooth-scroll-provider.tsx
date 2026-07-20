'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useEffect } from 'react'

declare global {
  interface Window {
    __nebuloidLenis?: Lenis
  }
}

function shouldEnableSmoothScroll() {
  if (typeof window === 'undefined') return false
  const finePointer = window.matchMedia('(pointer: fine)').matches
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return finePointer && !reducedMotion
}

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (!shouldEnableSmoothScroll()) {
      ScrollTrigger.refresh()
      return
    }

    const lenis = new Lenis({
      duration: 0.95,
      smoothWheel: true,
      touchMultiplier: 1.2,
      wheelMultiplier: 0.95,
    })

    const root = document.documentElement

    lenis.on('scroll', ScrollTrigger.update)

    ScrollTrigger.scrollerProxy(root, {
      scrollTop(value) {
        if (typeof value === 'number') {
          lenis.scrollTo(value, { immediate: true })
        }
        return lenis.scroll
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      },
      pinType: root.style.transform ? 'transform' : 'fixed',
    })

    const onRefresh = () => {
      lenis.resize()
    }

    ScrollTrigger.addEventListener('refresh', onRefresh)

    let frameId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }

    frameId = requestAnimationFrame(raf)
    ScrollTrigger.refresh()

    window.__nebuloidLenis = lenis

    return () => {
      cancelAnimationFrame(frameId)
      ScrollTrigger.removeEventListener('refresh', onRefresh)
      if (window.__nebuloidLenis === lenis) {
        delete window.__nebuloidLenis
      }
      lenis.destroy()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return <>{children}</>
}
