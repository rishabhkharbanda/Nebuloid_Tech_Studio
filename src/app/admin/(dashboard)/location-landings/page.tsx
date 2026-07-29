import Link from 'next/link'
import { LocationLandingBulkUpload } from '@/components/admin/location-landing-bulk-upload'
import { listLocationLandingsCms } from '@/lib/cms/queries'
import { SeedLocationLandingsButton } from '@/components/admin/seed-location-landings-button'

export default async function AdminLocationLandingsPage() {
  const pages = await listLocationLandingsCms()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Location Landings</h2>
          <p className="mt-2 text-sm text-[#6b7280]">
            Manage GEO pages like AI Photo Booth Delhi and Interactive Kiosk India.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SeedLocationLandingsButton />
          <Link
            href="/admin/location-landings/new"
            className="rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white"
          >
            New landing
          </Link>
        </div>
      </div>

      <LocationLandingBulkUpload />

      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-[#fafafa] text-xs uppercase tracking-[0.12em] text-[#6b7280]">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">City</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {pages.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-[#6b7280]">
                  No CMS location landings yet. Sync static defaults to import built-in GEO pages, or
                  create a new landing.
                </td>
              </tr>
            ) : (
              pages.map((page) => (
                <tr key={page.id} className="border-t border-black/5 hover:bg-black/[0.02]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/location-landings/${page.id}`}
                      className="font-medium hover:underline"
                    >
                      {page.title}
                    </Link>
                    <p className="text-xs text-[#6b7280]">/{page.slug}</p>
                  </td>
                  <td className="px-4 py-3">{page.city || '—'}</td>
                  <td className="px-4 py-3 capitalize">{page.status}</td>
                  <td className="px-4 py-3 text-[#6b7280]">
                    {page.updatedAt.toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
