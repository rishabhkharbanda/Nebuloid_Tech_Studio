import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DetailLayout } from '@/components/site/detail-layout'
import { PageShell } from '@/components/site/page-shell'
import { getAllProjectSlugs, getProjectBySlug } from '@/lib/content'

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

  return {
    title: project.title,
    description: project.intro,
  }
}

export default async function ExperiencePage({ params }: PageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  return (
    <PageShell>
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
