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
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
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
  }, [query])

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <label className="sr-only" htmlFor={`${listId}-search`}>
        Search site
      </label>
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
        onChange={(event) => {
          setQuery(event.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search…"
        role="combobox"
        aria-expanded={open && query.trim().length > 0}
        aria-controls={`${listId}-results`}
        aria-autocomplete="list"
        className={cn(
          'h-10 w-full rounded-full border pl-9 pr-9 text-sm outline-none transition focus:border-[#d4af37]/45 md:w-44 lg:w-52 xl:w-60',
          isDay
            ? 'border-black/15 bg-black/[0.04] text-[#181712] placeholder:text-[#181712]/35 focus:bg-black/[0.06]'
            : 'border-white/15 bg-white/[0.04] text-[#F1E9DB] placeholder:text-[#F1E9DB]/35 focus:bg-white/[0.07]',
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

      {open && query.trim() ? (
        <div
          id={`${listId}-results`}
          role="listbox"
          className={cn(
            'absolute right-0 top-[calc(100%+0.5rem)] z-[60] w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl',
            isDay
              ? 'border-black/12 bg-[#f4f0e7]/96 text-[#181712]'
              : 'border-white/12 bg-[#111111]/95 text-[#F1E9DB]',
          )}
        >
          {loading ? (
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
                    onClick={() => {
                      setOpen(false)
                      setQuery('')
                    }}
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
      ) : null}
    </div>
  )
}
