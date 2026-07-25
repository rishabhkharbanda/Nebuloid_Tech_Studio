import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { JsonLd } from '@/components/site/json-ld'
import { PageShell } from '@/components/site/page-shell'
import { getAllBlogSlugs, getBlogPostBySlug, getRelatedBlogPosts } from '@/lib/content'
import {
  createPageMetadata,
  getArticleSchema,
  getBreadcrumbSchema,
  parseBlogDate,
} from '@/lib/seo'

type PageProps = {
  params: Promise<{ slug: string }>
}

/** Keep CMS publishes visible without a full redeploy. */
export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return { title: 'Insight Not Found' }

  return createPageMetadata({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    path: `/insights/${slug}`,
    canonicalPath: post.canonicalPath || `/insights/${slug}`,
    image: post.ogImageUrl || post.image,
    type: 'article',
    noIndex: post.robotsIndex === false,
    publishedTime: post.datePublished || parseBlogDate(post.date),
    modifiedTime: post.dateModified || post.datePublished || parseBlogDate(post.date),
    authors: [post.authorName || 'Nebuloid Tech Studio'],
    keywords: [
      post.category.toLowerCase(),
      post.focusKeyword,
      'event insights',
      'event technology blog',
      'AI photo booth',
      'digital experiences',
    ].filter(Boolean),
  })
}

export default async function InsightPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()
  const related = await getRelatedBlogPosts(slug, 3)
  const published = post.datePublished || parseBlogDate(post.date)
  const modified = post.dateModified || published

  return (
    <PageShell>
      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blogs', path: '/insights' },
            { name: post.title, path: `/insights/${slug}` },
          ]),
          getArticleSchema({
            title: post.title,
            description: post.excerpt,
            path: post.canonicalPath || `/insights/${slug}`,
            image: post.ogImageUrl || post.image,
            datePublished: published,
            dateModified: modified,
            category: post.category,
            authorName: post.authorName,
          }),
        ]}
      />
      <article className="section-padding pb-32">
        <div className="content-grid">
          <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/40">
            <Link href="/" className="hover:text-[#d4af37]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/insights" className="hover:text-[#d4af37]">
              Blogs
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#F1E9DB]/60">{post.title}</span>
          </nav>

          <Link
            href="/insights"
            className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#F1E9DB]/50 transition-colors hover:text-[#d4af37]"
          >
            <ArrowLeft size={14} />
            All Blogs
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-[#F1E9DB]/50">
            <span className="text-[#d4af37]">{post.category}</span>
            <span>·</span>
            <time dateTime={published}>{post.date}</time>
            <span>·</span>
            <span>{post.readTime}</span>
            <span>·</span>
            <span>By {post.authorName || 'Nebuloid Tech Studio'}</span>
          </div>

          <h1 className="mt-6 max-w-4xl text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.95] tracking-[-0.03em]">
            {post.title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#F1E9DB]/70 md:text-xl">
            {post.excerpt}
          </p>

          {post.image ? (
            <div className="relative mt-12 aspect-[21/9] overflow-hidden rounded-3xl border border-white/10">
              <Image
                src={post.image}
                alt={post.imageAlt || post.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          ) : null}

          <div className="mx-auto mt-12 max-w-3xl space-y-6 border-t border-white/10 pt-12">
            {post.bodyHtml ? (
              <div
                className="space-y-6 text-lg leading-relaxed text-[#F1E9DB]/70 [&_a]:text-[#d4af37] [&_a]:underline [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[#F1E9DB] [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
              />
            ) : (
              post.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="text-lg leading-relaxed text-[#F1E9DB]/70"
                >
                  {paragraph}
                </p>
              ))
            )}
          </div>

          <aside className="mx-auto mt-12 max-w-3xl border-t border-white/10 pt-8 text-sm text-[#F1E9DB]/45">
            <p>
              Updated{' '}
              <time dateTime={modified}>
                {new Date(modified).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </p>
            <p className="mt-3">
              Explore related topics:{' '}
              <Link href="/technology/ai-photo-booths" className="text-[#d4af37] hover:underline">
                AI Photo Booths
              </Link>
              ,{' '}
              <Link href="/digital-experiences" className="text-[#d4af37] hover:underline">
                Digital Experiences
              </Link>
              ,{' '}
              <Link href="/solutions" className="text-[#d4af37] hover:underline">
                Event Solutions
              </Link>
              ,{' '}
              <Link href="/contact" className="text-[#d4af37] hover:underline">
                Contact
              </Link>
              .
            </p>
          </aside>

          {related.length > 0 ? (
            <section aria-labelledby="related-posts" className="mx-auto mt-16 max-w-3xl border-t border-white/10 pt-12">
              <h2 id="related-posts" className="text-2xl font-semibold tracking-[-0.02em]">
                Related blogs
              </h2>
              <ul className="mt-6 space-y-4">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/insights/${item.slug}`}
                      className="group flex items-start justify-between gap-4 border-b border-white/10 py-4"
                    >
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#d4af37]">
                          {item.category}
                        </p>
                        <p className="mt-2 text-lg font-medium transition group-hover:text-[#d4af37]">
                          {item.title}
                        </p>
                      </div>
                      <ArrowUpRight
                        size={16}
                        className="mt-2 shrink-0 text-[#F1E9DB]/40 transition group-hover:text-[#d4af37]"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

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
