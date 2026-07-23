import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DetailLayout } from '@/components/site/detail-layout'
import { JsonLd } from '@/components/site/json-ld'
import { PageShell } from '@/components/site/page-shell'
import type { PublicDigitalProject } from '@/lib/cms/types'
import { getAllDigitalProjectSlugs, getDigitalProjectBySlug } from '@/lib/content'
import { createPageMetadata, getBreadcrumbSchema } from '@/lib/seo'

type PageProps = {
  params: Promise<{ slug: string }>
}

function buildSections(project: PublicDigitalProject) {
  const sections: { title: string; items: string[] }[] = []
  const interactive = project.interactiveExperiences
  const hasGallery = project.gallery.length > 0

  if (interactive) {
    if (interactive.aiBooth?.length) {
      sections.push({
        title: 'AI Selfie Booth',
        items: [...interactive.aiBooth],
      })
    }
    if (interactive.games?.length) {
      sections.push({
        title: 'Interactive Games',
        items: [...interactive.games],
      })
    }
    if (interactive.technologies?.length && !hasGallery) {
      sections.push({
        title: 'Interactive Technologies',
        items: [...interactive.technologies],
      })
    }
  }

  if (project.impact.length) {
    sections.push({
      title: 'Business Impact',
      items: [...project.impact],
    })
  }

  return sections
}

function buildHighlights(project: PublicDigitalProject) {
  const hasGallery = project.gallery.length > 0
  if (!hasGallery) return [...project.contribution]

  const skip = new Set([
    'interactive gaming experiences',
    'gamification',
    'touchscreen experience design',
  ])
  return project.contribution.filter((item) => !skip.has(item.toLowerCase()))
}

export async function generateStaticParams() {
  const slugs = await getAllDigitalProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getDigitalProjectBySlug(slug)
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
  const project = await getDigitalProjectBySlug(slug)
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
        highlights={buildHighlights(project)}
        meta={[...project.techStack]}
        gallery={project.gallery.length ? [...project.gallery] : undefined}
        galleryTitle={project.galleryTitle}
        galleryHeading={project.galleryHeading}
        galleryAspect={project.galleryAspect}
      />
    </PageShell>
  )
}
