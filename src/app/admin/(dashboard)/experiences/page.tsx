import Link from 'next/link'
import { listExperienceServicesCms } from '@/lib/cms/queries'
import { ImportStaticExperiencesButton } from '@/components/admin/import-static-experiences-button'

export default async function ExperiencesAdminPage() {
  let services: Awaited<ReturnType<typeof listExperienceServicesCms>> = []
  let loadError = ''

  try {
    services = await listExperienceServicesCms(true)
  } catch {
    loadError =
      'Could not load experiences from the database. Run npm run cms:push after deploying schema changes.'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Experiences We Offer</h2>
          <p className="mt-2 text-sm text-[#6b7280]">
            Manage homepage cards and experience detail pages — add, edit, reorder, or remove
            capabilities.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ImportStaticExperiencesButton />
          <Link
            href="/admin/experiences/new"
            className="rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white"
          >
            Add experience
          </Link>
        </div>
      </div>

      {loadError ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.length === 0 ? (
          <p className="text-sm text-[#6b7280]">
            No CMS experiences yet. Static content remains on the public site until you add items
            here — use Import site content to copy the current six experiences.
          </p>
        ) : (
          services.map((service) => (
            <Link
              key={service.id}
              href={`/admin/experiences/${service.id}`}
              className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:border-[#d4af37]/50"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-[#6b7280]">
                #{service.displayOrder} · {service.displayLabel || '—'} · {service.status} ·{' '}
                {service.enabled ? 'Listed' : 'Hidden'}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{service.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-[#6b7280]">
                {service.description || service.detail}
              </p>
              <p className="mt-3 text-xs text-[#6b7280]">
                /experiences/{service.slug} · Tags: {service.tags?.length ?? 0}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
