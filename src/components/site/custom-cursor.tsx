'use client'

import { motion, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isPointer, setIsPointer] = useState(false)
  const x = useSpring(0, { stiffness: 380, damping: 30 })
  const y = useSpring(0, { stiffness: 380, damping: 30 })

  useEffect(() => {
    if (window.matchMedia('(max-width: 1024px)').matches) return

    const onMove = (event: MouseEvent) => {
      x.set(event.clientX - 10)
      y.set(event.clientY - 10)
      setIsVisible(true)
    }

    const onLeave = () => setIsVisible(false)
    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const interactive = target?.closest('a, button, input, textarea, select')
      setIsPointer(Boolean(interactive))
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout', onLeave)
    window.addEventListener('mouseover', onOver)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onLeave)
      window.removeEventListener('mouseover', onOver)
    }
  }, [x, y])

  return (
    <motion.div
      style={{ x, y }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isPointer ? 1.8 : 1,
      }}
      transition={{ duration: 0.2 }}
      className="pointer-events-none fixed left-0 top-0 z-[80] hidden h-5 w-5 rounded-full border border-[#d4af37]/70 mix-blend-difference lg:block"
    />
  )
}
