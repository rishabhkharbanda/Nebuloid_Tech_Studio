import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DetailLayout } from '@/components/site/detail-layout'
import { JsonLd } from '@/components/site/json-ld'
import { PageShell } from '@/components/site/page-shell'
import { getAllProjectSlugs, getProjectBySlug } from '@/lib/content'
import { createPageMetadata, getBreadcrumbSchema } from '@/lib/seo'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
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
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  return (
    <PageShell>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Experiences', path: '/experiences' },
          { name: project.title, path: `/experiences/${slug}` },
        ])}
      />
      <DetailLayout
        backHref="/experiences"
        backLabel="All Experiences"
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
