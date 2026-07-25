import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { GeoEnrichment } from '@/lib/geo-enrichment'

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

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4af37]" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  )
}

/** GEO semantic sections appended below existing detail UI without changing the hero layout. */
export function GeoDetailExtras({
  serviceName,
  geo,
}: {
  serviceName: string
  geo: GeoEnrichment
}) {
  return (
    <div className="content-grid section-padding pt-0 pb-32">
      <Section title={`What is ${serviceName}?`}>
        <p>{geo.whatIsIt}</p>
      </Section>

      <Section title="Benefits">
        <BulletList items={geo.benefits} />
      </Section>

      <Section title="Features">
        <BulletList items={geo.features} />
      </Section>

      <Section title="How it works">
        <ol className="list-decimal space-y-3 pl-5">
          {geo.howItWorks.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </Section>

      <Section title="Industries">
        <p>{geo.industries.join(' · ')}</p>
      </Section>

      <Section title="Use cases">
        <BulletList items={geo.useCases} />
      </Section>

      <Section title="Why choose Nebuloid">
        <BulletList items={geo.whyChooseUs} />
      </Section>

      <Section title="FAQs">
        <div className="space-y-6">
          {geo.faqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="text-lg font-semibold text-[#F1E9DB]">{faq.question}</h3>
              <p className="mt-2">{faq.answer}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Conclusion">
        <p>{geo.conclusion}</p>
      </Section>

      <nav aria-label="Related pages" className="mt-4 flex flex-wrap gap-4 border-t border-white/10 pt-10">
        {geo.relatedLinks.map((link) => (
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
    </div>
  )
}
