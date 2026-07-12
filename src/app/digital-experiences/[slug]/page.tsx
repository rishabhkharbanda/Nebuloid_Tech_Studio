import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DetailLayout } from '@/components/site/detail-layout'
import { JsonLd } from '@/components/site/json-ld'
import { PageShell } from '@/components/site/page-shell'
import { getAllDigitalProjectSlugs, getDigitalProjectBySlug } from '@/lib/content'
import { createPageMetadata, getBreadcrumbSchema } from '@/lib/seo'

type PageProps = {
  params: Promise<{ slug: string }>
}

function buildSections(project: NonNullable<ReturnType<typeof getDigitalProjectBySlug>>) {
  const sections: { title: string; content: string }[] = []
  const interactive =
    'interactiveExperiences' in project ? project.interactiveExperiences : undefined

  if (interactive) {
    if ('aiBooth' in interactive) {
      sections.push({
        title: 'AI Selfie Booth',
        content: interactive.aiBooth.join(' · '),
      })
    }
    if ('games' in interactive) {
      sections.push({
        title: 'Interactive Games',
        content: interactive.games.join(' · '),
      })
    }
    if ('technologies' in interactive) {
      sections.push({
        title: 'Interactive Technologies',
        content: interactive.technologies.join(' · '),
      })
    }
  }

  sections.push({
    title: 'Business Impact',
    content: project.impact.join(' · '),
  })

  return sections
}

export async function generateStaticParams() {
  return getAllDigitalProjectSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getDigitalProjectBySlug(slug)
  if (!project) return { title: 'Digital Experience Not Found' }

  return createPageMetadata({
    title: project.title,
    description: project.overview,
    path: `/digital-experiences/${slug}`,
    image: project.image,
    keywords: [
      project.client.toLowerCase(),
      ...project.category.split(' · ').map((item) => item.toLowerCase()),
      'digital experience case study',
    ],
  })
}

export default async function DigitalExperiencePage({ params }: PageProps) {
  const { slug } = await params
  const project = getDigitalProjectBySlug(slug)
  if (!project) notFound()

  return (
    <PageShell>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Digital Experiences', path: '/digital-experiences' },
          { name: project.title, path: `/digital-experiences/${slug}` },
        ])}
      />
      <DetailLayout
        backHref="/digital-experiences"
        backLabel="All Digital Experiences"
        category={project.category}
        title={project.title}
        image={project.image}
        intro={project.overview}
        sections={buildSections(project)}
        highlights={[...project.contribution]}
        meta={[...project.techStack]}
        gallery={'gallery' in project ? [...project.gallery] : undefined}
        galleryTitle={'gallery' in project ? 'AI Selfie Booth' : undefined}
      />
    </PageShell>
  )
}
