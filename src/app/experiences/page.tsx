import type { Metadata } from 'next'
import { JsonLd } from '@/components/site/json-ld'
import { DigitalSolutionsSection } from '@/components/site/digital-solutions-section'
import { IndustriesSection } from '@/components/site/industries-section'
import { ListingPage } from '@/components/site/listing-page'
import { PageShell } from '@/components/site/page-shell'
import { getExperienceServices, getProjectBySlug } from '@/lib/content'
import { projects } from '@/lib/site-data'
import { createPageMetadata, getBreadcrumbSchema, getItemListSchema } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Experiences We Offer',
  description:
    'Explore Nebuloid experiences we offer — event branding, registration systems, interactive installations, AI activations, analytics, and the capabilities behind every engagement layer.',
  path: '/experiences',
  keywords: [
    'event branding services',
    'event registration systems India',
    'interactive event technology',
    'AI event experiences',
    'AI photo booth for events',
    'digital experience capabilities',
  ],
})

export const revalidate = 60

export default async function ExperiencesIndexPage() {
  const services = await getExperienceServices()

  const capabilityItems = services.map((service) => ({
    href: `/experiences/${service.slug}`,
    title: service.title,
    category: `Capability ${service.id}`,
    description: service.description,
    image: service.image,
    meta: service.tags.join(' · '),
  }))

  const caseStudyItems = projects.map((project) => {
    const details = getProjectBySlug(project.slug)
    return {
      href: `/experiences/${project.slug}`,
      title: project.title,
      category: project.category,
      description:
        details?.intro ??
        `${project.tech} — a live deployment crafted for real audiences and real venues.`,
      image: project.image,
      meta: project.tech,
    }
  })

  return (
    <PageShell>
      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Experiences We Offer', path: '/experiences' },
          ]),
          getItemListSchema({
            name: 'Nebuloid Experiences We Offer',
            description: 'Event technology and experience capabilities.',
            path: '/experiences',
            items: services.map((service) => ({
              name: service.title,
              path: `/experiences/${service.slug}`,
              description: service.description,
            })),
          }),
        ]}
      />
      <ListingPage
        label="Experiences We Offer"
        title="Capabilities that power complete event ecosystems."
        description="A clear map of what Nebuloid builds — branding, technology, and engagement systems explained by capability, not by case study."
        items={capabilityItems}
      />
      <ListingPage
        label="Deployed Case Studies"
        title="Real implementations. Live audiences. Measurable outcomes."
        description="On-ground deployments that show how Nebuloid technology performs in the room."
        items={caseStudyItems}
      />
      <DigitalSolutionsSection showViewAll={false} />
      <IndustriesSection showViewAll={false} />
    </PageShell>
  )
}
