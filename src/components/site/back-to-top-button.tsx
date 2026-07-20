'use client'

import { ArrowUp } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function BackToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => {
      const y = window.__nebuloidLenis?.scroll ?? window.scrollY
      setVisible(y > 480)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })

    let detachLenis: (() => void) | undefined
    const attachTimer = window.setInterval(() => {
      const lenis = window.__nebuloidLenis
      if (!lenis || detachLenis) return
      lenis.on('scroll', update)
      detachLenis = () => lenis.off('scroll', update)
      window.clearInterval(attachTimer)
    }, 150)

    return () => {
      window.removeEventListener('scroll', update)
      window.clearInterval(attachTimer)
      detachLenis?.()
    }
  }, [])

  const scrollToTop = () => {
    const lenis = window.__nebuloidLenis
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 })
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.94 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className={cn(
            'fixed bottom-[5.5rem] right-4 z-[90] inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#F1E9DB]/20 bg-[#090909]/85 text-[#F1E9DB] shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md transition-colors',
            'hover:border-[#d4af37]/55 hover:bg-[#111111] hover:text-[#d4af37]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/60',
            'md:bottom-8 md:right-6 md:h-14 md:w-14',
          )}
        >
          <ArrowUp size={18} strokeWidth={1.8} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
