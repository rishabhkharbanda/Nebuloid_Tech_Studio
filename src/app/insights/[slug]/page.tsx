import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { JsonLd } from '@/components/site/json-ld'
import { PageShell } from '@/components/site/page-shell'
import { getAllBlogSlugs, getBlogPostBySlug } from '@/lib/content'
import {
  createPageMetadata,
  getArticleSchema,
  getBreadcrumbSchema,
  parseBlogDate,
} from '@/lib/seo'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) return { title: 'Insight Not Found' }

  return createPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/insights/${slug}`,
    image: post.image,
    type: 'article',
    keywords: [post.category.toLowerCase(), 'event insights', 'event technology blog'],
  })
}

export default async function InsightPage({ params }: PageProps) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) notFound()

  return (
    <PageShell>
      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Insights', path: '/insights' },
            { name: post.title, path: `/insights/${slug}` },
          ]),
          getArticleSchema({
            title: post.title,
            description: post.excerpt,
            path: `/insights/${slug}`,
            image: post.image,
            datePublished: parseBlogDate(post.date),
            category: post.category,
          }),
        ]}
      />
      <article className="section-padding pb-32">
        <div className="content-grid">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#F1E9DB]/50 transition-colors hover:text-[#d4af37]"
          >
            <ArrowLeft size={14} />
            All Insights
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-[#F1E9DB]/50">
            <span className="text-[#d4af37]">{post.category}</span>
            <span>·</span>
            <time dateTime={parseBlogDate(post.date)}>{post.date}</time>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>

          <h1 className="mt-6 max-w-4xl text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.95] tracking-[-0.03em]">
            {post.title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#F1E9DB]/70 md:text-xl">
            {post.excerpt}
          </p>

          <div className="relative mt-12 aspect-[21/9] overflow-hidden rounded-3xl border border-white/10">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-6 border-t border-white/10 pt-12">
            {post.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-lg leading-relaxed text-[#F1E9DB]/70"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mx-auto mt-16 max-w-3xl border-t border-white/10 pt-12">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-full border border-[#F1E9DB]/25 px-6 py-4 text-sm font-medium transition-all duration-300 hover:border-[#d4af37]/50 hover:bg-[#F1E9DB]/5 md:text-base"
            >
              Discuss Your Next Event
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F1E9DB]/20 transition-all group-hover:border-[#d4af37]/40">
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          </div>
        </div>
      </article>
    </PageShell>
  )
}
