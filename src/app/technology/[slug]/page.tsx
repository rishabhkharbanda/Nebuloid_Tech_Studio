import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DetailLayout } from '@/components/site/detail-layout'
import { GeoDetailExtras } from '@/components/site/geo-detail-extras'
import { JsonLd } from '@/components/site/json-ld'
import { PageShell } from '@/components/site/page-shell'
import { getAllTechnologySlugs, getTechnologyBySlug } from '@/lib/content'
import { getTechnologyGeoOrFallback } from '@/lib/geo-enrichment'
import {
  createPageMetadata,
  getBreadcrumbSchema,
  getFaqSchema,
  getServiceSchema,
} from '@/lib/seo'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllTechnologySlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const technology = getTechnologyBySlug(slug)
  if (!technology) return { title: 'Technology Not Found' }

  return createPageMetadata({
    title: technology.title,
    description: technology.intro,
    path: `/technology/${slug}`,
    image: technology.image,
    keywords: [
      technology.title.toLowerCase(),
      'event technology',
      'corporate event systems',
      'AI photo booth',
      'interactive kiosks',
    ],
  })
}

export default async function TechnologyDetailPage({ params }: PageProps) {
  const { slug } = await params
  const technology = getTechnologyBySlug(slug)
  if (!technology) notFound()
  const geo = getTechnologyGeoOrFallback(
    slug,
    technology.title,
    technology.intro,
    technology.highlights,
  )

  return (
    <PageShell>
      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Technology', path: '/technology' },
            { name: technology.title, path: `/technology/${slug}` },
          ]),
          getServiceSchema({
            name: technology.title,
            description: technology.intro,
            path: `/technology/${slug}`,
            image: technology.image,
          }),
          ...(geo ? [getFaqSchema(geo.faqs)] : []),
        ]}
      />
      <DetailLayout
        backHref="/technology"
        backLabel="All Technology"
        category="Technology"
        title={technology.title}
        image={technology.image}
        imageAlt={`${technology.title} — Nebuloid event technology`}
        intro={technology.intro}
        sections={technology.sections}
        highlights={technology.highlights}
      />
      <GeoDetailExtras serviceName={technology.title} geo={geo} />
    </PageShell>
  )
}
