'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'

const ScrollExploreSequence = dynamic(
  () =>
    import('@/components/site/scroll-explore-sequence').then(
      (mod) => mod.ScrollExploreSequence,
    ),
  {
    ssr: false,
    loading: () => (
      <section aria-hidden className="relative z-0 h-[100vh] overflow-hidden bg-[#090909]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/scroll-sequence-hd/frame-001.jpg"
          alt=""
          className="h-full w-full object-cover opacity-80"
        />
      </section>
    ),
  },
)

export function HomeScrollExplore() {
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = '/assets/scroll-sequence-hd/frame-001.jpg'
    document.head.appendChild(link)
    return () => {
      link.remove()
    }
  }, [])

  return <ScrollExploreSequence />
}
