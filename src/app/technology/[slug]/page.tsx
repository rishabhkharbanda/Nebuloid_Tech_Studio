import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DetailLayout } from '@/components/site/detail-layout'
import { JsonLd } from '@/components/site/json-ld'
import { PageShell } from '@/components/site/page-shell'
import { getAllTechnologySlugs, getTechnologyBySlug } from '@/lib/content'
import { createPageMetadata, getBreadcrumbSchema } from '@/lib/seo'

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
    ],
  })
}

export default async function TechnologyDetailPage({ params }: PageProps) {
  const { slug } = await params
  const technology = getTechnologyBySlug(slug)
  if (!technology) notFound()

  return (
    <PageShell>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Technology', path: '/technology' },
          { name: technology.title, path: `/technology/${slug}` },
        ])}
      />
      <DetailLayout
        backHref="/technology"
        backLabel="All Technology"
        category="Technology"
        title={technology.title}
        image={technology.image}
        intro={technology.intro}
        sections={technology.sections}
        highlights={technology.highlights}
      />
    </PageShell>
  )
}
