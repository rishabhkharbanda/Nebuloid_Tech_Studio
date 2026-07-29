import { HeroSlideEditor } from '@/components/admin/hero-slide-editor'

export default function NewHeroSlidePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Add hero slide</h2>
        <p className="mt-2 text-sm text-[#6b7280]">
          Create a homepage carousel banner with its own image and text.
        </p>
      </div>
      <HeroSlideEditor />
    </div>
  )
}
