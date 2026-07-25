import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'
import { JsonLd } from '@/components/site/json-ld'
import { PageShell } from '@/components/site/page-shell'
import {
  getAllLocationLandingSlugs,
  resolveLocationLandingBySlug,
} from '@/lib/location-landings'
import {
  createPageMetadata,
  getBreadcrumbSchema,
  getFaqSchema,
  getServiceSchema,
} from '@/lib/seo'

type PageProps = { params: Promise<{ slug: string }> }

/** Known static landings always build; CMS-only slugs resolve at request time. */
export const dynamicParams = true
export const revalidate = 60

export async function generateStaticParams() {
  return getAllLocationLandingSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await resolveLocationLandingBySlug(slug)
  if (!page) return { title: 'Page Not Found' }
  return createPageMetadata({
    title: page.metaTitle || page.title,
    description: page.metaDescription,
    path: `/${slug}`,
    canonicalPath: page.canonicalPath || `/${slug}`,
    image: page.ogImageUrl || undefined,
    noIndex: page.robotsIndex === false,
    keywords: [
      page.focusKeyword,
      page.serviceLabel,
      page.city,
      'event technology India',
      'experiential marketing',
      'AI photo booth',
    ],
  })
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-white/10 py-10">
      <h2 className="text-2xl font-semibold tracking-[-0.02em] text-[#F1E9DB] md:text-3xl">
        {title}
      </h2>
      <div className="mt-5 text-base leading-relaxed text-[#F1E9DB]/70 md:text-lg">{children}</div>
    </section>
  )
}

export default async function LocationLandingPage({ params }: PageProps) {
  const { slug } = await params
  const page = await resolveLocationLandingBySlug(slug)
  if (!page) notFound()

  return (
    <PageShell>
      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: page.title, path: `/${slug}` },
          ]),
          getServiceSchema({
            name: page.title,
            description: page.metaDescription,
            path: `/${slug}`,
            image: page.ogImageUrl || undefined,
          }),
          getFaqSchema(page.faqs),
        ]}
      />
      <article className="content-grid section-padding pb-32">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
          {page.serviceLabel} · {page.city}
        </p>
        <h1 className="mt-4 max-w-4xl text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[0.95] tracking-[-0.03em]">
          {page.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#F1E9DB]/70">{page.heroIntro}</p>

        <Section title={`What is ${page.serviceLabel}?`}>
          <p>{page.whatIsIt}</p>
        </Section>

        <Section title="Benefits">
          <ul className="space-y-3">
            {page.benefits.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4af37]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Features">
          <ul className="space-y-3">
            {page.features.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4af37]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="How it works">
          <ol className="list-decimal space-y-3 pl-5">
            {page.howItWorks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </Section>

        <Section title="Industries">
          <p>{page.industries.join(' · ')}</p>
        </Section>

        <Section title="Use cases">
          <ul className="space-y-3">
            {page.useCases.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4af37]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Why choose Nebuloid">
          <ul className="space-y-3">
            {page.whyChooseUs.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4af37]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="FAQs">
          <div className="space-y-6">
            {page.faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-lg font-semibold text-[#F1E9DB]">{faq.question}</h3>
                <p className="mt-2">{faq.answer}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Conclusion">
          <p>{page.conclusion}</p>
        </Section>

        <nav aria-label="Related pages" className="mt-10 flex flex-wrap gap-4 border-t border-white/10 pt-10">
          {page.relatedPaths.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-2 text-sm text-[#F1E9DB]/60 transition hover:text-[#d4af37]"
            >
              {link.label}
              <ArrowUpRight size={14} aria-hidden />
            </Link>
          ))}
        </nav>
      </article>
    </PageShell>
  )
}
