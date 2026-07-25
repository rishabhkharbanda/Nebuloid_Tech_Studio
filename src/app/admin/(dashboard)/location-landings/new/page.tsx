import { LocationLandingEditor } from '@/components/admin/location-landing-editor'

export default function NewLocationLandingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">New location landing</h2>
        <p className="mt-2 text-sm text-[#6b7280]">
          Create a city or region GEO page with full semantic sections and SEO controls.
        </p>
      </div>
      <LocationLandingEditor />
    </div>
  )
}
