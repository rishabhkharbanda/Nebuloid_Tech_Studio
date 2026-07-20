'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const CustomCursor = dynamic(
  () => import('@/components/site/custom-cursor').then((mod) => mod.CustomCursor),
  { ssr: false },
)

export function DeferredCustomCursor() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(max-width: 1024px)').matches) return

    const enable = () => setEnabled(true)
    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(enable, { timeout: 1800 })
    } else {
      timeoutId = setTimeout(enable, 900)
    }

    return () => {
      if (idleId !== undefined && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId)
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId)
    }
  }, [])

  if (!enabled) return null
  return <CustomCursor />
}
