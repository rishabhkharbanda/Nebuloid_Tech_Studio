import Link from 'next/link'
import { listBlogPostsCms, listDigitalCardsCms, listMediaAssets } from '@/lib/cms/queries'
import { hasDatabase } from '@/db/client'

export default async function AdminDashboardPage() {
  const enabled = hasDatabase()
  const [posts, cards, media] = enabled
    ? await Promise.all([listBlogPostsCms(), listDigitalCardsCms(true), listMediaAssets()])
    : [[], [], []]

  const published = posts.filter((p) => p.status === 'published').length
  const drafts = posts.filter((p) => p.status === 'draft').length
  const enabledCards = cards.filter((c) => c.enabled).length

  const stats = [
    { label: 'Published blogs', value: published, href: '/admin/blogs' },
    { label: 'Draft blogs', value: drafts, href: '/admin/blogs' },
    { label: 'Digital cards', value: enabledCards, href: '/admin/digital-experiences' },
    { label: 'Media assets', value: media.length, href: '/admin/media' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Dashboard</h2>
        <p className="mt-2 text-sm text-[#6b7280]">
          Manage website content without changing the public UI.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:border-[#d4af37]/50"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
              {stat.label}
            </p>
            <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href="/admin/blogs/new"
          className="rounded-2xl bg-[#111827] px-5 py-4 text-sm font-medium text-white"
        >
          Create blog post
        </Link>
        <Link
          href="/admin/digital-experiences/new"
          className="rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm font-medium"
        >
          Add digital experience card
        </Link>
        <Link
          href="/admin/media"
          className="rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm font-medium"
        >
          Open media library
        </Link>
      </div>
    </div>
  )
}
