import Link from 'next/link'
import Image from 'next/image'
import { BlogBulkUpload } from '@/components/admin/blog-bulk-upload'
import { listBlogPostsCms } from '@/lib/cms/queries'
import { getDefaultBlogImageUrl, resolveBlogImage } from '@/lib/blog-image'

export default async function AdminBlogsPage() {
  const [posts, defaultImage] = await Promise.all([
    listBlogPostsCms(),
    getDefaultBlogImageUrl(),
  ])

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

      <BlogBulkUpload />

      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-[#fafafa] text-xs uppercase tracking-[0.12em] text-[#6b7280]">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Image</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-[#6b7280]">
                  No CMS posts yet. Create one, or keep using static site content until the database
                  is connected.
                </td>
              </tr>
            ) : (
              posts.map((post) => {
                const hasImage = Boolean(post.featuredImageUrl?.trim())
                return (
                  <tr key={post.id} className="border-t border-black/5 hover:bg-black/[0.02]">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/blogs/${post.id}`}
                        className="font-medium hover:underline"
                      >
                        {post.title}
                      </Link>
                      <p className="text-xs text-[#6b7280]">/{post.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-14 overflow-hidden rounded-md border border-black/10 bg-[#f3f4f6]">
                          <Image
                            src={resolveBlogImage(post.featuredImageUrl, defaultImage)}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                        <span
                          className={
                            hasImage
                              ? 'rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700'
                              : 'rounded-full bg-black/5 px-2.5 py-1 text-xs font-medium text-[#6b7280]'
                          }
                        >
                          {hasImage ? 'Image' : 'No image'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize">{post.status}</td>
                    <td className="px-4 py-3">{post.category || '—'}</td>
                    <td className="px-4 py-3 text-[#6b7280]">
                      {post.updatedAt.toLocaleDateString()}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
