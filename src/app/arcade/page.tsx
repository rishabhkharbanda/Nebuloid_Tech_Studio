import type { Metadata } from 'next'
import { ArcadeLanding } from '@/components/site/arcade-landing'
import { JsonLd } from '@/components/site/json-ld'
import { PageShell } from '@/components/site/page-shell'
import { createPageMetadata, getBreadcrumbSchema } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Nebuloid Arcade — Interactive Engagement Layer',
  description:
    'Play Nebuloid Arcade: spin wheel, slots, racing, and archery mini-games built as a drop-in engagement SDK for apps, venues, and event experiences.',
  path: '/arcade',
  keywords: [
    'Nebuloid Arcade',
    'event engagement games',
    'interactive reward SDK',
    'spin wheel activation',
    'event mini games India',
  ],
})

export default function ArcadePage() {
  return (
    <PageShell withTopPadding={false}>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Arcade', path: '/arcade' },
        ])}
      />
      <ArcadeLanding />
    </PageShell>
  )
}
