import type { Metadata } from 'next'
import { PageShell } from '@/components/site/page-shell'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for Nebuloid Tech Studio LLP.',
}

export default function TermsPage() {
  return (
    <PageShell>
      <div className="section-padding pb-32">
        <div className="content-grid mx-auto max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            Legal
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.03em] md:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-[#F1E9DB]/45">
            Last updated: July 2026
          </p>

          <div className="mt-12 space-y-8 text-lg leading-relaxed text-[#F1E9DB]/70">
            <section>
              <h2 className="text-xl font-semibold text-[#F1E9DB]">Services</h2>
              <p className="mt-4">
                Nebuloid Tech Studio LLP provides event experience design, creative
                production, and event technology services. Specific deliverables,
                timelines, and fees are defined in individual project agreements.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#F1E9DB]">Intellectual Property</h2>
              <p className="mt-4">
                Unless otherwise agreed in writing, intellectual property rights for
                custom work created for a client are transferred upon full payment.
                Nebuloid retains the right to showcase completed work in its portfolio
                unless confidentiality is explicitly requested.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#F1E9DB]">Limitation of Liability</h2>
              <p className="mt-4">
                Nebuloid Tech Studio LLP is not liable for indirect, incidental, or
                consequential damages arising from the use of our services or website.
                Liability is limited to the fees paid for the specific project in
                question.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#F1E9DB]">Contact</h2>
              <p className="mt-4">
                For questions about these terms, contact{' '}
                <a
                  href="mailto:nebuloidtechstudio1@gmail.com"
                  className="text-[#d4af37] hover:underline"
                >
                  nebuloidtechstudio1@gmail.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
