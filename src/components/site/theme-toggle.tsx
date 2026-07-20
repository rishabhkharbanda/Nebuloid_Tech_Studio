'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import { toggleTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useTheme()

  return (
    <button
      type="button"
      onClick={() => toggleTheme()}
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
