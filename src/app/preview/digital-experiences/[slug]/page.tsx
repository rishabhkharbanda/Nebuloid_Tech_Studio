import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DetailLayout } from '@/components/site/detail-layout'
import { PageShell } from '@/components/site/page-shell'
import { getDigitalByPreviewToken, mapCmsDigitalToPublic } from '@/lib/cms/queries'
import type { PublicDigitalProject } from '@/lib/cms/types'

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ token?: string }>
}

export const metadata: Metadata = {
  title: 'Preview · Digital Experience',
  robots: { index: false, follow: false },
}

function buildSections(project: PublicDigitalProject) {
  const sections: { title: string; items: string[] }[] = []
  const interactive = project.interactiveExperiences
  if (interactive?.aiBooth?.length) {
    sections.push({ title: 'AI Selfie Booth', items: [...interactive.aiBooth] })
  }
  if (interactive?.games?.length) {
    sections.push({ title: 'Interactive Games', items: [...interactive.games] })
  }
  if (interactive?.technologies?.length) {
    sections.push({ title: 'Interactive Technologies', items: [...interactive.technologies] })
  }
  if (project.impact.length) {
    sections.push({ title: 'Business Impact', items: [...project.impact] })
  }
  return sections
}

export default async function PreviewDigitalPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { token } = await searchParams
  if (!token) notFound()

  const card = await getDigitalByPreviewToken(slug, token)
  if (!card) notFound()
  const project = mapCmsDigitalToPublic(card)

  return (
    <PageShell>
      <div className="border-b border-[#d4af37]/40 bg-[#d4af37]/15 px-4 py-3 text-center text-sm text-[#F1E9DB]">
        Draft preview — not publicly indexed · status: {card.status}
      </div>
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
        gallery={project.gallery.length ? [...project.gallery] : undefined}
        galleryTitle={project.galleryTitle}
        galleryHeading={project.galleryHeading}
        galleryAspect={project.galleryAspect}
      />
    </PageShell>
  )
}
