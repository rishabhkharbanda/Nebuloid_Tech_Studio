'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export function SectionReveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
      animate={
        inView
          ? { opacity: 1, y: 0, filter: 'blur(0px)' }
          : { opacity: 0, y: 40, filter: 'blur(12px)' }
      }
      transition={{ duration: 0.85, ease: [0.2, 0.65, 0.3, 0.9], delay }}
    >
      {children}
    </motion.div>
  )
}
