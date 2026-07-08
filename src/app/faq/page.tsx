import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PageShell } from '@/components/site/page-shell'
import { faqs } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'FAQs',
  description:
    'Frequently asked questions about Nebuloid Tech Studio event experience and creative technology services.',
}

export default function FaqPage() {
  return (
    <PageShell>
      <div className="section-padding pb-32">
        <div className="content-grid">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            FAQs
          </p>
          <h1 className="mt-4 max-w-3xl text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.03em]">
            Questions worth asking before your next event.
          </h1>

          <div className="mt-16 divide-y divide-white/10 border-y border-white/10">
            {faqs.map((faq) => (
              <div key={faq.question} className="py-10 md:py-12">
                <h2 className="text-xl font-semibold leading-snug tracking-[-0.02em] md:text-2xl">
                  {faq.question}
                </h2>
                <p className="mt-4 max-w-3xl leading-relaxed text-[#F1E9DB]/65 md:text-lg">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/contact"
            className="group mt-16 inline-flex items-center gap-3 rounded-full border border-[#F1E9DB]/25 px-6 py-4 text-base font-medium transition-all hover:border-[#d4af37]/50 hover:bg-[#F1E9DB]/5"
          >
            Still have questions? Get in touch
            <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
