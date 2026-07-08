import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DetailLayout } from '@/components/site/detail-layout'
import { JsonLd } from '@/components/site/json-ld'
import { PageShell } from '@/components/site/page-shell'
import { getAllIndustrySlugs, getIndustryBySlug } from '@/lib/content'
import { createPageMetadata, getBreadcrumbSchema } from '@/lib/seo'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllIndustrySlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const industry = getIndustryBySlug(slug)
  if (!industry) return { title: 'Industry Not Found' }

  return createPageMetadata({
    title: `${industry.title} Event Solutions`,
    description: industry.intro,
    path: `/industries/${slug}`,
    image: industry.image,
    keywords: [
      industry.title.toLowerCase(),
      'event experience',
      'creative technology events',
    ],
  })
}

export default async function IndustryPage({ params }: PageProps) {
  const { slug } = await params
  const industry = getIndustryBySlug(slug)
  if (!industry) notFound()

  return (
    <PageShell>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Industries', path: '/industries' },
          { name: industry.title, path: `/industries/${slug}` },
        ])}
      />
      <DetailLayout
        backHref="/industries"
        backLabel="All Industries"
        category="Industry"
        title={industry.title}
        image={industry.image}
        intro={industry.intro}
        sections={industry.sections}
        highlights={industry.highlights}
      />
    </PageShell>
  )
}
