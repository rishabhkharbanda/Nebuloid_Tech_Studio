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
  const sections: { title: string; items: string[] }[] = []
  const interactive =
    'interactiveExperiences' in project ? project.interactiveExperiences : undefined
  const hasGallery = 'gallery' in project && project.gallery.length > 0

  if (interactive) {
    if ('aiBooth' in interactive) {
      sections.push({
        title: 'AI Selfie Booth',
        items: [...interactive.aiBooth],
      })
    }
    if ('games' in interactive) {
      sections.push({
        title: 'Interactive Games',
        items: [...interactive.games],
      })
    }
    // Skip technologies when the gallery already labels each installation —
    // avoids repeating the same capability names twice on the page.
    if ('technologies' in interactive && !hasGallery) {
      sections.push({
        title: 'Interactive Technologies',
        items: [...interactive.technologies],
      })
    }
  }

  sections.push({
    title: 'Business Impact',
    items: [...project.impact],
  })

  return sections
}

function buildHighlights(project: NonNullable<ReturnType<typeof getDigitalProjectBySlug>>) {
  const hasGallery = 'gallery' in project && project.gallery.length > 0
  if (!hasGallery) return [...project.contribution]

  // Drop deliverables that merely restate gallery-covered tech / games.
  const skip = new Set([
    'interactive gaming experiences',
    'gamification',
    'touchscreen experience design',
  ])
  return project.contribution.filter((item) => !skip.has(item.toLowerCase()))
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
        highlights={buildHighlights(project)}
        meta={[...project.techStack]}
        gallery={'gallery' in project ? [...project.gallery] : undefined}
        galleryTitle={
          'galleryTitle' in project ? project.galleryTitle : undefined
        }
        galleryHeading={
          'galleryHeading' in project ? project.galleryHeading : undefined
        }
        galleryAspect={
          'galleryAspect' in project ? project.galleryAspect : undefined
        }
      />
    </PageShell>
  )
}
