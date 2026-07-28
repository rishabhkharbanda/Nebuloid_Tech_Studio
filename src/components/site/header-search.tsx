'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SearchResult } from '@/lib/search-index'

export function HeaderSearch({ className }: { className?: string }) {
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
    <div ref={rootRef} className={cn('header-search relative', className)}>
      <label className="sr-only" htmlFor={`${listId}-search`}>
        Search site
      </label>
      <Search
        size={15}
        className="header-search-icon pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#F1E9DB]/40"
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
        className="header-search-input h-10 w-full rounded-full border border-white/15 bg-white/[0.04] pl-9 pr-9 text-sm text-[#F1E9DB] outline-none transition placeholder:text-[#F1E9DB]/35 focus:border-[#d4af37]/45 focus:bg-white/[0.07] md:w-44 lg:w-52 xl:w-60"
      />
      {query ? (
        <button
          type="button"
          onClick={() => {
            setQuery('')
            setResults([])
            inputRef.current?.focus()
          }}
          className="header-search-clear absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#F1E9DB]/45 hover:text-[#d4af37]"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      ) : null}

      {open && query.trim() ? (
        <div
          id={`${listId}-results`}
          role="listbox"
          className="header-search-results absolute right-0 top-[calc(100%+0.5rem)] z-[60] w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border border-white/12 bg-[#090909]/95 shadow-2xl backdrop-blur-xl"
        >
          {loading ? (
            <p className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/45">
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
                    className="header-search-result block px-4 py-3 transition hover:bg-white/[0.05]"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#d4af37]">
                      {item.category}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#F1E9DB]">{item.title}</p>
                    {item.excerpt ? (
                      <p className="mt-1 line-clamp-2 text-xs text-[#F1E9DB]/50">{item.excerpt}</p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-[#F1E9DB]/55">No results found.</p>
          )}
        </div>
      ) : null}
    </div>
  )
}
