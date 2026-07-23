import { BlogEditor } from '@/components/admin/blog-editor'

type PageProps = { params: Promise<{ id: string }> }

export default async function EditBlogPage({ params }: PageProps) {
  const { id } = await params
  return <BlogEditor postId={id} />
}
