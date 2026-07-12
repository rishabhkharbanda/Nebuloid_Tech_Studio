import type { Metadata } from 'next'
import { ListingPage } from '@/components/site/listing-page'
import { PageShell } from '@/components/site/page-shell'
import { digitalCapabilities } from '@/lib/digital-data'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Digital Experience Capabilities',
  description:
    'Explore Nebuloid capabilities — interactive experience platforms, AI selfie booths, touchscreen kiosks, government digital platforms, visitor engagement systems, and more.',
  path: '/capabilities',
  keywords: [
    'digital experience capabilities',
    'interactive platform development',
    'AI event technology services',
    'touchscreen kiosk solutions',
    'visitor engagement technology',
  ],
})

export default function CapabilitiesPage() {
  const items = digitalCapabilities.map((capability) => ({
    href: capability.href,
    title: capability.title,
    category: capability.category,
    description: capability.description,
    meta: `Capability ${capability.id}`,
  }))

  return (
    <PageShell>
      <ListingPage
        label="Capabilities"
        title="Technology we build to create unforgettable digital experiences."
        description="From AI-powered activations and interactive gaming to government platforms and enterprise websites — every capability is custom-built for real-world engagement."
        items={items}
      />
    </PageShell>
  )
}
