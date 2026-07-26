'use client'

import { useEffect, useState } from 'react'
import type { BlogHeading } from '@/lib/blog-html'

export type { BlogHeading }

export function BlogToc({ headings }: { headings: BlogHeading[] }) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? '')

  useEffect(() => {
    if (headings.length === 0) return

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((node): node is HTMLElement => Boolean(node))

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 2) return null

  return (
    <nav aria-label="On this page" className="mb-10 border-b border-white/10 pb-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/40">
        On this page
      </p>
      <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {headings.map((heading) => {
          const active = heading.id === activeId
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={[
                  'block text-sm transition',
                  active
                    ? 'text-[#d4af37]'
                    : 'text-[#F1E9DB]/55 hover:text-[#F1E9DB]',
                ].join(' ')}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
