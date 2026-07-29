'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'
import type { SearchResult } from '@/lib/search-index'

export function HeaderSearch({ className }: { className?: string }) {
  const theme = useTheme()
  const isDay = theme === 'day'
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [panelOpen, setPanelOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!panelOpen || !query.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&limit=8`, {
          signal: controller.signal,
        })
        if (!res.ok) return
        const data = (await res.json()) as { results: SearchResult[] }
        setResults(data.results ?? [])
      } catch {
        if (!controller.signal.aborted) setResults([])
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 220)

    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [query, panelOpen])

  useEffect(() => {
    if (!panelOpen) return
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30)
    return () => window.clearTimeout(timer)
  }, [panelOpen])

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setPanelOpen(false)
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setPanelOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  function closePanel() {
    setPanelOpen(false)
    setQuery('')
    setResults([])
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setPanelOpen((prev) => !prev)}
        aria-label={panelOpen ? 'Close search' : 'Open search'}
        aria-expanded={panelOpen}
        aria-controls={`${listId}-panel`}
        className={cn(
          'inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300',
          panelOpen
            ? 'border-[#d4af37]/50 text-[#d4af37]'
            : 'border-white/20 text-[#F1E9DB] hover:border-[#d4af37]/50 hover:text-[#d4af37]',
        )}
      >
        {panelOpen ? <X size={18} strokeWidth={1.75} /> : <Search size={18} strokeWidth={1.75} />}
      </button>

      {panelOpen ? (
        <div
          id={`${listId}-panel`}
          className={cn(
            'absolute right-0 top-[calc(100%+0.65rem)] z-[70] w-[min(100vw-2rem,20rem)] overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl sm:w-[22rem]',
            isDay
              ? 'border-black/12 bg-[#f4f0e7]/96 text-[#181712]'
              : 'border-white/12 bg-[#111111]/95 text-[#F1E9DB]',
          )}
        >
          <div className={cn('border-b p-3', isDay ? 'border-black/10' : 'border-white/10')}>
            <label className="sr-only" htmlFor={`${listId}-search`}>
              Search site
            </label>
            <div className="relative">
              <Search
                size={15}
                className={cn(
                  'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2',
                  isDay ? 'text-[#181712]/40' : 'text-[#F1E9DB]/40',
                )}
                aria-hidden
              />
              <input
                ref={inputRef}
                id={`${listId}-search`}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pages, work, blogs…"
                role="combobox"
                aria-expanded={query.trim().length > 0}
                aria-controls={`${listId}-results`}
                aria-autocomplete="list"
                className={cn(
                  'h-11 w-full rounded-xl border pl-9 pr-9 text-sm outline-none transition focus:border-[#d4af37]/45',
                  isDay
                    ? 'border-black/12 bg-black/[0.03] text-[#181712] placeholder:text-[#181712]/35'
                    : 'border-white/12 bg-white/[0.03] text-[#F1E9DB] placeholder:text-[#F1E9DB]/35',
                )}
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setResults([])
                    inputRef.current?.focus()
                  }}
                  className={cn(
                    'absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 transition hover:text-[#d4af37]',
                    isDay ? 'text-[#181712]/45' : 'text-[#F1E9DB]/45',
                  )}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              ) : null}
            </div>
          </div>

          <div id={`${listId}-results`} role="listbox">
            {!query.trim() ? (
              <p
                className={cn(
                  'px-4 py-3 text-sm',
                  isDay ? 'text-[#181712]/55' : 'text-[#F1E9DB]/55',
                )}
              >
                Start typing to search the site.
              </p>
            ) : loading ? (
              <p
                className={cn(
                  'px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em]',
                  isDay ? 'text-[#181712]/45' : 'text-[#F1E9DB]/45',
                )}
              >
                Searching…
              </p>
            ) : results.length ? (
              <ul className="max-h-72 overflow-y-auto py-1">
                {results.map((item) => (
                  <li key={item.href} role="option">
                    <Link
                      href={item.href}
                      onClick={closePanel}
                      className={cn(
                        'block px-4 py-3 transition',
                        isDay ? 'hover:bg-black/[0.05]' : 'hover:bg-white/[0.05]',
                      )}
                    >
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#d4af37]">
                        {item.category}
                      </p>
                      <p
                        className={cn(
                          'mt-1 text-sm font-medium',
                          isDay ? 'text-[#181712]' : 'text-[#F1E9DB]',
                        )}
                      >
                        {item.title}
                      </p>
                      {item.excerpt ? (
                        <p
                          className={cn(
                            'mt-1 line-clamp-2 text-xs',
                            isDay ? 'text-[#181712]/55' : 'text-[#F1E9DB]/50',
                          )}
                        >
                          {item.excerpt}
                        </p>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p
                className={cn(
                  'px-4 py-3 text-sm',
                  isDay ? 'text-[#181712]/55' : 'text-[#F1E9DB]/55',
                )}
              >
                No results found.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
