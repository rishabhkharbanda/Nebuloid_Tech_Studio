import { LocationLandingEditor } from '@/components/admin/location-landing-editor'

type PageProps = { params: Promise<{ id: string }> }

export default async function EditLocationLandingPage({ params }: PageProps) {
  const { id } = await params
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Edit location landing</h2>
        <p className="mt-2 text-sm text-[#6b7280]">
          Update GEO content, FAQs, internal links, and SEO metadata.
        </p>
      </div>
      <LocationLandingEditor pageId={id} />
    </div>
  )
}
