import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageShell } from '@/components/site/page-shell'
import { getBlogByPreviewToken, mapCmsBlogToPublic } from '@/lib/cms/queries'

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ token?: string }>
}

export const metadata: Metadata = {
  title: 'Preview · Blog',
  robots: { index: false, follow: false },
}

export default async function PreviewBlogPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { token } = await searchParams
  if (!token) notFound()

  const row = await getBlogByPreviewToken(slug, token)
  if (!row) notFound()
  const post = mapCmsBlogToPublic(row)

  return (
    <PageShell>
      <div className="border-b border-[#d4af37]/40 bg-[#d4af37]/15 px-4 py-3 text-center text-sm text-[#F1E9DB]">
        Draft preview — not publicly indexed · status: {row.status}
      </div>
      <article className="content-grid section-padding max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#d4af37]">
          {post.category} · {post.date} · {post.readTime}
        </p>
        <h1 className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight tracking-[-0.03em]">
          {post.title}
        </h1>
        <p className="mt-6 text-lg text-[#F1E9DB]/70">{post.excerpt}</p>
        <div className="prose prose-invert mt-10 max-w-none space-y-4 text-[#F1E9DB]/80">
          {post.bodyHtml ? (
            <div dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
          ) : (
            post.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
          )}
        </div>
      </article>
    </PageShell>
  )
}
