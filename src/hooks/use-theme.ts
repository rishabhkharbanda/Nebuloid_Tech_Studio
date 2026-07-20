'use client'

import { useEffect, useState } from 'react'
import {
  THEME_CHANGE_EVENT,
  applyTheme,
  getDocumentTheme,
  getStoredTheme,
  type Theme,
} from '@/lib/theme'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const initial = getStoredTheme()
    applyTheme(initial)
    setTheme(getDocumentTheme())

    const onThemeChange = (event: Event) => {
      const next = (event as CustomEvent<Theme>).detail
      if (next === 'day' || next === 'dark') setTheme(next)
    }

    window.addEventListener(THEME_CHANGE_EVENT, onThemeChange)
    return () => window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange)
  }, [])

  return theme
}
