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
  const inView = useInView(ref, { once: true, amount: 0.15, margin: '0px 0px -8% 0px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9], delay }}
    >
      {children}
    </motion.div>
  )
}
