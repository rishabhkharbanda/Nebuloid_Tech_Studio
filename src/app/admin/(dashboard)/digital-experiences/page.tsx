import Link from 'next/link'
import { listDigitalCardsCms } from '@/lib/cms/queries'

export default async function DigitalExperiencesAdminPage() {
  const cards = await listDigitalCardsCms(true)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Digital Experiences</h2>
          <p className="mt-2 text-sm text-[#6b7280]">
            Manage homepage/listing cards: content, CTA, order, and visibility.
          </p>
        </div>
        <Link
          href="/admin/digital-experiences/new"
          className="rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white"
        >
          Add card
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.length === 0 ? (
          <p className="text-sm text-[#6b7280]">
            No CMS cards yet. Static digital projects remain on the public site until you add cards
            here.
          </p>
        ) : (
          cards.map((card) => (
            <Link
              key={card.id}
              href={`/admin/digital-experiences/${card.id}`}
              className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:border-[#d4af37]/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#6b7280]">
                    #{card.displayOrder} · {card.enabled ? 'Enabled' : 'Disabled'}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">{card.title}</h3>
                </div>
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-[#6b7280]">{card.shortDescription}</p>
              <p className="mt-3 text-xs text-[#6b7280]">
                CTA: {card.ctaText} → {card.ctaHref || '—'}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
