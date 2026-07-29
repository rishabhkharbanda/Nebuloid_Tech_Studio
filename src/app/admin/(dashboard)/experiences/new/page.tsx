import { ExperienceServiceEditor } from '@/components/admin/experience-service-editor'

export default function NewExperiencePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Add experience</h2>
        <p className="mt-2 text-sm text-[#6b7280]">
          Create a new capability for Experiences We Offer — homepage cards and detail page.
        </p>
      </div>
      <ExperienceServiceEditor />
    </div>
  )
}
