import type { Metadata } from 'next'
import { PageShell } from '@/components/site/page-shell'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Nebuloid Tech Studio LLP.',
}

export default function PrivacyPage() {
  return (
    <PageShell>
      <div className="section-padding pb-32">
        <div className="content-grid mx-auto max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            Legal
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.03em] md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-[#F1E9DB]/45">
            Last updated: July 2026
          </p>

          <div className="mt-12 space-y-8 text-lg leading-relaxed text-[#F1E9DB]/70">
            <section>
              <h2 className="text-xl font-semibold text-[#F1E9DB]">Information We Collect</h2>
              <p className="mt-4">
                When you contact us through our website, we collect information you
                provide — such as your name, email address, company, and message
                content — to respond to your inquiry and discuss potential projects.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#F1E9DB]">How We Use Information</h2>
              <p className="mt-4">
                We use contact information solely to communicate about your event
                requirements, provide proposals, and deliver services you engage us
                for. We do not sell personal data to third parties.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#F1E9DB]">Data Security</h2>
              <p className="mt-4">
                We take reasonable measures to protect information shared with us.
                However, no method of transmission over the internet is completely
                secure.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#F1E9DB]">Contact</h2>
              <p className="mt-4">
                For privacy-related questions, contact us at{' '}
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
