import type { Metadata } from 'next'
import { ListingPage } from '@/components/site/listing-page'
import { PageShell } from '@/components/site/page-shell'
import { getIndustryBySlug } from '@/lib/content'
import { industries } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Industries',
  description:
    'Event experience and creative technology solutions across corporate, healthcare, education, government, and more.',
}

export default function IndustriesIndexPage() {
  const items = industries.map((industry) => {
    const details = getIndustryBySlug(industry.slug)
    return {
      href: `/industries/${industry.slug}`,
      title: industry.title,
      category: 'Industry',
      description: details?.intro ?? industry.description,
      image: industry.image,
    }
  })

  return (
    <PageShell>
      <ListingPage
        label="Industries We Serve"
        title="Every industry has its own rhythm."
        description="We design experiences that match yours — from corporate summits to medical conferences, exhibitions, and public ceremonies."
        items={items}
      />
    </PageShell>
  )
}
