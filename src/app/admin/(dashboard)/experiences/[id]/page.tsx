import { ExperienceServiceEditor } from '@/components/admin/experience-service-editor'

type PageProps = { params: Promise<{ id: string }> }

export default async function EditExperiencePage({ params }: PageProps) {
  const { id } = await params
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Edit experience</h2>
        <p className="mt-2 text-sm text-[#6b7280]">
          Update copy, imagery, tags, detail sections, and SEO for this capability.
        </p>
      </div>
      <ExperienceServiceEditor serviceId={id} />
    </div>
  )
}
