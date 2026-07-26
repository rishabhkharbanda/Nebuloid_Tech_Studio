'use client'

import { useEffect } from 'react'
import { ScrollExploreSequence } from '@/components/site/scroll-explore-sequence'
import {
  SCROLL_EXPLORE_POSTER_SRC,
  SCROLL_EXPLORE_VIDEO_SRC,
} from '@/lib/scroll-explore'

export function HomeScrollExplore() {
  useEffect(() => {
    const poster = document.createElement('link')
    poster.rel = 'preload'
    poster.as = 'image'
    poster.href = SCROLL_EXPLORE_POSTER_SRC
    document.head.appendChild(poster)

    const video = document.createElement('link')
    video.rel = 'preload'
    video.as = 'video'
    video.href = SCROLL_EXPLORE_VIDEO_SRC
    video.type = 'video/mp4'
    document.head.appendChild(video)

    return () => {
      poster.remove()
      video.remove()
    }
  }, [])

  // Sync client import keeps the 280vh shell in the first HTML paint (no dynamic swap CLS).
  return <ScrollExploreSequence />
}
