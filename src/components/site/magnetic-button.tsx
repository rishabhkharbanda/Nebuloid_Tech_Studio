'use client'

import { gsap } from 'gsap'
import { useRef } from 'react'
import { Button, type ButtonProps } from '@/components/ui/button'

export function MagneticButton({ children, ...props }: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)

  const onMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2
    gsap.to(ref.current, {
      x: x * 0.18,
      y: y * 0.18,
      duration: 0.35,
      ease: 'power2.out',
    })
  }

  const onLeave = () => {
    if (!ref.current) return
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.45,
      ease: 'elastic.out(1, 0.35)',
    })
  }

  return (
    <Button ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} {...props}>
      {children}
    </Button>
  )
}
