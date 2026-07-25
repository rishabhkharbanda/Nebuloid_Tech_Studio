import Link from 'next/link'
import { PageShell } from '@/components/site/page-shell'

export default function NotFound() {
  return (
    <PageShell>
      <section className="content-grid section-padding pb-32">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">404</p>
        <h1 className="mt-4 max-w-3xl text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.95] tracking-[-0.03em]">
          Page not found.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-[#F1E9DB]/65">
          This URL is not available. Explore our solutions, digital experiences, or latest blogs
          instead.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/"
            className="rounded-full border border-[#F1E9DB]/25 px-6 py-3 text-sm font-medium transition hover:border-[#d4af37]/50"
          >
            Home
          </Link>
          <Link
            href="/insights"
            className="rounded-full border border-[#F1E9DB]/25 px-6 py-3 text-sm font-medium transition hover:border-[#d4af37]/50"
          >
            Blogs
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-[#F1E9DB]/25 px-6 py-3 text-sm font-medium transition hover:border-[#d4af37]/50"
          >
            Contact
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
