'use client'

import { ScrollExploreSequence } from '@/components/site/scroll-explore-sequence'

export function HomeScrollExplore() {
  // Keep the 280vh shell in the first HTML paint (no dynamic swap CLS).
  // Do not preload the video here — it loads when the section nears the viewport.
  return <ScrollExploreSequence />
}
