'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  THEME_CHANGE_EVENT,
  applyTheme,
  getStoredTheme,
  toggleTheme,
  type Theme,
} from '@/lib/theme'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setThemeState] = useState<Theme>('dark')

  useEffect(() => {
    const initial = getStoredTheme()
    applyTheme(initial)
    setThemeState(initial)

    const onThemeChange = (event: Event) => {
      const next = (event as CustomEvent<Theme>).detail
      if (next === 'day' || next === 'dark') setThemeState(next)
    }

    window.addEventListener(THEME_CHANGE_EVENT, onThemeChange)
    return () => window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange)
  }, [])

  return (
    <button
      type="button"
      onClick={() => setThemeState(toggleTheme())}
      aria-label={theme === 'dark' ? 'Switch to daylight mode' : 'Switch to night mode'}
      title={theme === 'dark' ? 'Daylight mode' : 'Night mode'}
      className={cn(
        'inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-[#F1E9DB] transition-colors duration-300 hover:border-[#d4af37]/50 hover:text-[#d4af37]',
        className,
      )}
    >
      {theme === 'dark' ? <Sun size={18} strokeWidth={1.75} /> : <Moon size={18} strokeWidth={1.75} />}
    </button>
  )
}
