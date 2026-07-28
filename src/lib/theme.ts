export const THEME_STORAGE_KEY = 'nebuloid-theme'
export const THEME_CHANGE_EVENT = 'nebuloid-theme-change'

export type Theme = 'dark' | 'day'

/** Default site theme is light (day). Users who pick dark store `'dark'`. */
export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'day'
  return window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'day'
}

export function getDocumentTheme(): Theme {
  if (typeof document === 'undefined') return 'day'
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

/** Inline script for <head> — prevents dark flash on first paint. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='dark'){document.documentElement.classList.add('day-theme');document.documentElement.style.colorScheme='light';}}catch(e){document.documentElement.classList.add('day-theme');document.documentElement.style.colorScheme='light';}})();`
