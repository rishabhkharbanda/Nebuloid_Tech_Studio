import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DetailLayout } from '@/components/site/detail-layout'
import { PageShell } from '@/components/site/page-shell'
import { getAllIndustrySlugs, getIndustryBySlug } from '@/lib/content'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllIndustrySlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const industry = getIndustryBySlug(slug)
  if (!industry) return { title: 'Industry Not Found' }

  return {
    title: industry.title,
    description: industry.description,
  }
}

export default async function IndustryPage({ params }: PageProps) {
  const { slug } = await params
  const industry = getIndustryBySlug(slug)
  if (!industry) notFound()

  return (
    <PageShell>
      <DetailLayout
        backHref="/industries"
        backLabel="All Industries"
        category="Industry"
        title={industry.title}
        image={industry.image}
        intro={industry.intro}
        sections={industry.sections}
        highlights={industry.highlights}
      />
    </PageShell>
  )
}
