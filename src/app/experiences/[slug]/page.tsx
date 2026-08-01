import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DetailLayout } from '@/components/site/detail-layout'
import { GeoDetailExtras } from '@/components/site/geo-detail-extras'
import { JsonLd } from '@/components/site/json-ld'
import { PageShell } from '@/components/site/page-shell'
import {
  getAllProjectSlugs,
  getAllServiceSlugs,
  getExperienceServiceBySlug,
  getProjectBySlug,
} from '@/lib/content'
import { getServiceGeo } from '@/lib/geo-enrichment'
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
  const serviceSlugs = await getAllServiceSlugs()
  return [
    ...serviceSlugs.map((slug) => ({ slug })),
    ...getAllProjectSlugs().map((slug) => ({ slug })),
  ]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const service = await getExperienceServiceBySlug(slug)
  if (service) {
    return createPageMetadata({
      title: service.metaTitle || service.title,
      description: service.metaDescription || service.intro,
      path: `/experiences/${slug}`,
      canonicalPath: service.canonicalPath || `/experiences/${slug}`,
      image: service.image,
      keywords: [
        service.focusKeyword,
        ...service.tags.map((tag) => tag.toLowerCase()),
        'event experience',
        'interactive installation',
      ].filter((item): item is string => Boolean(item)),
    })
  }

  const project = getProjectBySlug(slug)
  if (!project) return { title: 'Experience Not Found' }

  return createPageMetadata({
    title: project.title,
    description: project.intro,
    path: `/experiences/${slug}`,
    image: project.image,
    keywords: [
      project.category.toLowerCase(),
      ...project.tech.split(' · ').map((item) => item.toLowerCase()),
      'event case study',
    ],
  })
}

export default async function ExperiencePage({ params }: PageProps) {
  const { slug } = await params
  const service = await getExperienceServiceBySlug(slug)

  if (service) {
    const geo = getServiceGeo(slug)
    return (
      <PageShell>
        <JsonLd
          data={[
            getBreadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Experiences We Offer', path: '/experiences' },
              { name: service.title, path: `/experiences/${slug}` },
            ]),
            getServiceSchema({
              name: service.title,
              description: service.intro,
              path: `/experiences/${slug}`,
              image: service.image,
            }),
            ...(geo ? [getFaqSchema(geo.faqs)] : []),
          ]}
        />
        <DetailLayout
          backHref="/experiences"
          backLabel="Experiences We Offer"
          category={`Capability ${service.id}`}
          title={service.title}
          image={service.image}
          imageAlt={service.imageAlt || `${service.title} — Nebuloid experience`}
          intro={service.intro}
          sections={service.sections}
          highlights={service.highlights}
          meta={[...service.tags]}
        />
        {geo ? <GeoDetailExtras serviceName={service.title} geo={geo} /> : null}
      </PageShell>
    )
  }

  const project = getProjectBySlug(slug)
  if (!project) notFound()

  return (
    <PageShell>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Experiences We Offer', path: '/experiences' },
          { name: project.title, path: `/experiences/${slug}` },
        ])}
      />
      <DetailLayout
        backHref="/experiences"
        backLabel="Experiences We Offer"
        category={project.category}
        title={project.title}
        image={project.image}
        intro={project.intro}
        sections={project.sections}
        highlights={project.highlights}
        meta={project.tech.split(' · ')}
      />
    </PageShell>
  )
}
