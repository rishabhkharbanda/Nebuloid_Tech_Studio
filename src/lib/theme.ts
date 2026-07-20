export const THEME_STORAGE_KEY = 'nebuloid-theme'
export const THEME_CHANGE_EVENT = 'nebuloid-theme-change'

export type Theme = 'dark' | 'day'

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  return window.localStorage.getItem(THEME_STORAGE_KEY) === 'day' ? 'day' : 'dark'
}

export function getDocumentTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.classList.contains('day-theme') ? 'day' : 'dark'
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('day-theme', theme === 'day')
  document.documentElement.style.colorScheme = theme === 'day' ? 'light' : 'dark'
}

export function setTheme(theme: Theme) {
  applyTheme(theme)
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: theme }))
}

export function toggleTheme(): Theme {
  const nextTheme: Theme = getDocumentTheme() === 'dark' ? 'day' : 'dark'
  setTheme(nextTheme)
  return nextTheme
}
