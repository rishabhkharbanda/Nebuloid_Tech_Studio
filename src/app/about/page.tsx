import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PageShell } from '@/components/site/page-shell'
import { processSteps, stats } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Nebuloid Tech Studio is an event experience and creative technology company designing complete event ecosystems.',
}

export default function AboutPage() {
  return (
    <PageShell>
      <div className="section-padding pb-32">
        <div className="content-grid">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            Why Nebuloid
          </p>
          <h1 className="mt-4 max-w-4xl text-[clamp(2.5rem,6.5vw,5.5rem)] font-bold leading-[0.92] tracking-[-0.04em]">
            We don&apos;t plan events.
            <br />
            <span className="text-gradient-gold">We create experiences.</span>
          </h1>

          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            <div className="space-y-6 text-lg leading-relaxed text-[#F1E9DB]/70">
              <p>
                Nebuloid Tech Studio exists because events deserve more than
                logistics and more than software. We are a creative technology
                partner — designing complete event ecosystems where branding,
                motion, interactive installations, and digital systems work as
                one.
              </p>
              <p>
                Every touchpoint has intent. Every interaction has purpose.
                Every experience is built to be remembered.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-10">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
                Our Approach
              </p>
              <p className="mt-6 leading-relaxed text-[#F1E9DB]/70">
                We combine event branding, creative production, and interactive
                technology into one seamless partner — so you work with one team,
                not five vendors.
              </p>
            </div>
          </div>

          <div className="mt-20 border-t border-white/10 pt-16">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
              Our Process
            </p>
            <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {processSteps.map((step, index) => (
                <div
                  key={step.step}
                  className="rounded-3xl border border-white/10 bg-white/[0.02] p-8"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#F1E9DB]/45">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h2 className="mt-4 text-2xl font-semibold">{step.step}</h2>
                  <p className="mt-3 text-[#F1E9DB]/65">{step.description}</p>
                </div>
              ))}
            </div>
            <Link
              href="/process"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#F1E9DB]/50 transition-colors hover:text-[#d4af37]"
            >
              View full process
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="mt-20 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/10 bg-white/[0.02] p-8"
              >
                <p className="text-5xl font-bold tracking-[-0.03em]">
                  {stat.value}
                  {stat.suffix}
                </p>
                <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-[#F1E9DB]/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/contact"
            className="group mt-16 inline-flex items-center gap-3 rounded-full border border-[#F1E9DB]/25 px-6 py-4 text-base font-medium transition-all hover:border-[#d4af37]/50 hover:bg-[#F1E9DB]/5"
          >
            Start a Collaboration
            <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
