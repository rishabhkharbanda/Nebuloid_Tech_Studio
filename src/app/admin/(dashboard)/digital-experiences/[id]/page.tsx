import { DigitalCardEditor } from '@/components/admin/digital-card-editor'

type PageProps = { params: Promise<{ id: string }> }

export default async function EditDigitalCardPage({ params }: PageProps) {
  const { id } = await params
  return <DigitalCardEditor cardId={id} />
}
