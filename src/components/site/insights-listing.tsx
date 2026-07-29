'use client'

import { useDeferredValue, useMemo, useState } from 'react'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { StretchLink } from '@/components/site/stretch-link'

export type InsightsListItem = {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  readTime: string
  image?: string
  imageAlt?: string
}

export function InsightsListing({
  posts,
  initialCategory = 'All',
}: {
  posts: InsightsListItem[]
  initialCategory?: string
}) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(initialCategory || 'All')
  const deferredQuery = useDeferredValue(query)

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(posts.map((post) => post.category).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b))
    return ['All', ...unique]
  }, [posts])

  // Keep deep-linked category valid once posts load.
  const safeCategory = categories.includes(category) ? category : 'All'

  const filtered = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase()
    return posts.filter((post) => {
      const matchesCategory = safeCategory === 'All' || post.category === safeCategory
      if (!matchesCategory) return false
      if (!needle) return true
      return [post.title, post.excerpt, post.category].some((value) =>
        value.toLowerCase().includes(needle),
      )
    })
  }, [posts, safeCategory, deferredQuery])

  const [featured, ...rest] = filtered

  return (
    <div className="section-padding pb-32">
      <div className="content-grid">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
          Blogs
        </p>
        <h1 className="mt-4 max-w-4xl text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.95] tracking-[-0.03em]">
          Thinking on events, experience, and creative technology.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#F1E9DB]/65">
          Perspectives on event branding, guest journeys, AI experiences, and the craft of
          designing memorable corporate events.
        </p>

        <div className="mt-12 flex flex-col gap-6 border-y border-white/10 py-6 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block w-full max-w-xl">
            <span className="sr-only">Search blogs</span>
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#F1E9DB]/35"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search titles, topics, or keywords"
              className="w-full rounded-full border border-white/12 bg-white/[0.03] py-3.5 pl-11 pr-11 text-sm text-[#F1E9DB] outline-none transition placeholder:text-[#F1E9DB]/35 focus:border-[#d4af37]/45 focus:bg-white/[0.05]"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[#F1E9DB]/45 transition hover:text-[#d4af37]"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            ) : null}
          </label>

          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/40 lg:text-right">
            {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
            {safeCategory !== 'All' ? ` · ${safeCategory}` : ''}
          </p>
        </div>

        <div
          className="mt-6 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Filter by category"
        >
          {categories.map((item) => {
            const active = item === safeCategory
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(item)}
                className={[
                  'shrink-0 rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition',
                  active
                    ? 'border-[#d4af37]/55 bg-[#d4af37]/12 text-[#d4af37]'
                    : 'border-white/12 text-[#F1E9DB]/55 hover:border-white/25 hover:text-[#F1E9DB]',
                ].join(' ')}
              >
                {item}
              </button>
            )
          })}
        </div>

        {featured ? (
          <div className="mt-10 border-y border-white/10">
            <article className="group relative py-10 md:py-14">
              <StretchLink
                href={`/insights/${featured.slug}`}
                label={`Read featured article: ${featured.category}`}
              />
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-[#F1E9DB]/50">
                <span className="text-[#d4af37]">Featured</span>
                <span>·</span>
                <span>{featured.category}</span>
                <span>·</span>
                <span>{featured.date}</span>
                <span>·</span>
                <span>{featured.readTime}</span>
              </div>

              <h2 className="mt-5 max-w-4xl text-[clamp(1.85rem,4vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[#F1E9DB] transition-colors group-hover:text-[#d4af37]">
                {featured.title}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#F1E9DB]/65 md:text-lg">
                {featured.excerpt}
              </p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#F1E9DB]/55 transition-all group-hover:gap-3 group-hover:text-[#d4af37]">
                Read story
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </article>

            <div className="divide-y divide-white/10">
              {rest.map((post) => (
                <article
                  key={post.slug}
                  className="group relative grid gap-4 py-8 transition-colors hover:bg-white/[0.02] md:grid-cols-12 md:items-center md:gap-10 md:py-10"
                >
                  <StretchLink
                    href={`/insights/${post.slug}`}
                    label={`Read ${post.category} article`}
                  />

                  <div className="md:col-span-11">
                    <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#F1E9DB]/45">
                      <span className="text-[#d4af37]">{post.category}</span>
                      <span>·</span>
                      <span>{post.date}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-[#F1E9DB] transition-colors group-hover:text-[#d4af37] md:text-2xl">
                      {post.title}
                    </h3>
                    <p className="mt-3 max-w-2xl leading-relaxed text-[#F1E9DB]/55">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex md:col-span-1 md:justify-end">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-[#F1E9DB]/40 transition-all group-hover:border-[#d4af37]/50 group-hover:text-[#d4af37]">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-16 border border-dashed border-white/15 px-6 py-16 text-center">
            <p className="text-lg text-[#F1E9DB]/70">No articles match that search.</p>
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setCategory('All')
              }}
              className="mt-5 font-mono text-xs uppercase tracking-[0.16em] text-[#d4af37] transition hover:text-[#F1E9DB]"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
