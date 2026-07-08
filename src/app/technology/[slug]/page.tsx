import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DetailLayout } from '@/components/site/detail-layout'
import { PageShell } from '@/components/site/page-shell'
import { getAllTechnologySlugs, getTechnologyBySlug } from '@/lib/content'

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

  return {
    title: technology.title,
    description: technology.intro,
  }
}

export default async function TechnologyDetailPage({ params }: PageProps) {
  const { slug } = await params
  const technology = getTechnologyBySlug(slug)
  if (!technology) notFound()

  return (
    <PageShell>
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
