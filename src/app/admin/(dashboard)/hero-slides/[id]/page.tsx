import { HeroSlideEditor } from '@/components/admin/hero-slide-editor'

type PageProps = { params: Promise<{ id: string }> }

export default async function EditHeroSlidePage({ params }: PageProps) {
  const { id } = await params
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Edit hero slide</h2>
        <p className="mt-2 text-sm text-[#6b7280]">
          Update the banner image, headline, and supporting copy for this carousel slide.
        </p>
      </div>
      <HeroSlideEditor slideId={id} />
    </div>
  )
}
