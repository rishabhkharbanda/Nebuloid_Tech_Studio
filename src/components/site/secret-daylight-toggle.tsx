'use client'

import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'nebuloid-theme'
const HOLD_DURATION = 1200

type Theme = 'dark' | 'day'

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('day-theme', theme === 'day')
  document.documentElement.style.colorScheme = theme === 'day' ? 'light' : 'dark'
}

export function SecretDaylightToggle() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [holding, setHolding] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY)
    const initialTheme: Theme = storedTheme === 'day' ? 'day' : 'dark'

    applyTheme(initialTheme)
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
      const currentTheme: Theme = document.documentElement.classList.contains('day-theme')
        ? 'day'
        : 'dark'
      const nextTheme: Theme = currentTheme === 'dark' ? 'day' : 'dark'

      applyTheme(nextTheme)
      window.localStorage.setItem(STORAGE_KEY, nextTheme)
      setNotice(nextTheme === 'day' ? 'Daylight mode enabled' : 'Night mode enabled')
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
