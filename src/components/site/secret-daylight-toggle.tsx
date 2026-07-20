'use client'

import { useEffect, useRef, useState } from 'react'
import {
  THEME_CHANGE_EVENT,
  applyTheme,
  getDocumentTheme,
  getStoredTheme,
  setTheme,
  type Theme,
} from '@/lib/theme'

const HOLD_DURATION = 1200

export function SecretDaylightToggle() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [holding, setHolding] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    applyTheme(getStoredTheme())
  }, [])

  useEffect(() => {
    const onThemeChange = (event: Event) => {
      const next = (event as CustomEvent<Theme>).detail
      if (next !== 'day' && next !== 'dark') return
      setNotice(next === 'day' ? 'Daylight mode enabled' : 'Night mode enabled')
    }

    window.addEventListener(THEME_CHANGE_EVENT, onThemeChange)
    return () => window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange)
  }, [])

  useEffect(() => {
    if (!notice) return

    const timeout = window.setTimeout(() => setNotice(null), 1800)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const stopHolding = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setHolding(false)
  }

  const startHolding = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setHolding(true)

    timerRef.current = setTimeout(() => {
      const nextTheme: Theme = getDocumentTheme() === 'dark' ? 'day' : 'dark'
      setTheme(nextTheme)
      setHolding(false)
      timerRef.current = null
    }, HOLD_DURATION)
  }

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    [],
  )

  return (
    <>
      <button
        type="button"
        aria-label="Hold to switch the site theme"
        className="secret-theme-hotspot"
        data-holding={holding}
        onPointerDown={startHolding}
        onPointerUp={stopHolding}
        onPointerCancel={stopHolding}
        onPointerLeave={stopHolding}
        onContextMenu={(event) => event.preventDefault()}
      >
        <span className="sr-only">Hold to switch the site theme</span>
      </button>

      {notice && (
        <div className="theme-notice" role="status" aria-live="polite">
          {notice}
        </div>
      )}
    </>
  )
}
