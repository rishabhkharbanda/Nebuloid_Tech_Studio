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
      <section
        aria-hidden
        className="relative z-0 h-[240vh] min-h-[240vh] overflow-hidden bg-[#090909]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/scroll-explore-poster.jpg"
          alt=""
          className="sticky top-0 h-screen w-full object-cover opacity-80"
        />
      </section>
    ),
  },
)

export function HomeScrollExplore() {
  useEffect(() => {
    const poster = document.createElement('link')
    poster.rel = 'preload'
    poster.as = 'image'
    poster.href = '/assets/scroll-explore-poster.jpg'
    document.head.appendChild(poster)

    const video = document.createElement('link')
    video.rel = 'preload'
    video.as = 'video'
    video.href = '/assets/scroll-explore.mp4'
    video.type = 'video/mp4'
    document.head.appendChild(video)

    return () => {
      poster.remove()
      video.remove()
    }
  }, [])

  return <ScrollExploreSequence />
}
