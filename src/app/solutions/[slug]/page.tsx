import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DetailLayout } from '@/components/site/detail-layout'
import { JsonLd } from '@/components/site/json-ld'
import { PageShell } from '@/components/site/page-shell'
import { getAllServiceSlugs, getServiceBySlug } from '@/lib/content'
import { createPageMetadata, getBreadcrumbSchema, getServiceSchema } from '@/lib/seo'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) return { title: 'Solution Not Found' }

  return createPageMetadata({
    title: service.title,
    description: service.intro,
    path: `/solutions/${slug}`,
    image: service.image,
    keywords: [...service.tags.map((tag) => tag.toLowerCase()), 'event solution'],
  })
}

export default async function SolutionPage({ params }: PageProps) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) notFound()

  return (
    <PageShell>
      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Solutions', path: '/solutions' },
            { name: service.title, path: `/solutions/${slug}` },
          ]),
          getServiceSchema({
            name: service.title,
            description: service.intro,
            path: `/solutions/${slug}`,
            image: service.image,
          }),
        ]}
      />
      <DetailLayout
        backHref="/solutions"
        backLabel="All Solutions"
        category={`Solution ${service.id}`}
        title={service.title}
        image={service.image}
        intro={service.intro}
        sections={service.sections}
        highlights={service.highlights}
        meta={[...service.tags]}
      />
    </PageShell>
  )
}
