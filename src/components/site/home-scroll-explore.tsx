'use client'

import dynamic from 'next/dynamic'

const ScrollExploreSequence = dynamic(
  () =>
    import('@/components/site/scroll-explore-sequence').then(
      (mod) => mod.ScrollExploreSequence,
    ),
  {
    ssr: false,
    loading: () => (
      <section aria-hidden className="relative z-0 h-[100vh] bg-[#090909]" />
    ),
  },
)

export function HomeScrollExplore() {
  return <ScrollExploreSequence />
}
