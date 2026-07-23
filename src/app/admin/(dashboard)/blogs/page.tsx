import Link from 'next/link'
import { listBlogPostsCms } from '@/lib/cms/queries'

export default async function AdminBlogsPage() {
  const posts = await listBlogPostsCms()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Blog Management</h2>
          <p className="mt-2 text-sm text-[#6b7280]">
            Create, edit, publish, and optimize insight posts.
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white"
        >
          New post
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-[#fafafa] text-xs uppercase tracking-[0.12em] text-[#6b7280]">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-[#6b7280]">
                  No CMS posts yet. Create one, or keep using static site content until the database
                  is connected.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-t border-black/5 hover:bg-black/[0.02]">
                  <td className="px-4 py-3">
                    <Link href={`/admin/blogs/${post.id}`} className="font-medium hover:underline">
                      {post.title}
                    </Link>
                    <p className="text-xs text-[#6b7280]">/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3 capitalize">{post.status}</td>
                  <td className="px-4 py-3">{post.category || '—'}</td>
                  <td className="px-4 py-3 text-[#6b7280]">
                    {post.updatedAt.toLocaleDateString()}
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
