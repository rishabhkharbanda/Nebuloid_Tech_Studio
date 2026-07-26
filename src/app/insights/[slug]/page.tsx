import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { BlogArticleTools } from '@/components/site/blog-article-tools'
import { BlogToc } from '@/components/site/blog-toc'
import { JsonLd } from '@/components/site/json-ld'
import { PageShell } from '@/components/site/page-shell'
import { enrichBlogHtml } from '@/lib/blog-html'
import { getAllBlogSlugs, getBlogPostBySlug, getRelatedBlogPosts } from '@/lib/content'
import {
  absoluteUrl,
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
  const articleUrl = absoluteUrl(post.canonicalPath || `/insights/${slug}`)
  const { html: bodyHtml, headings } = enrichBlogHtml(post.bodyHtml || '')

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
          <nav
            aria-label="Breadcrumb"
            className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/40"
          >
            <Link href="/" className="hover:text-[#d4af37]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/insights" className="hover:text-[#d4af37]">
              Blogs
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#F1E9DB]/60">{post.category}</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#F1E9DB]/50 transition-colors hover:text-[#d4af37]"
            >
              <ArrowLeft size={14} />
              All blogs
            </Link>
            <Link
              href={`/insights?category=${encodeURIComponent(post.category)}`}
              className="font-mono text-xs uppercase tracking-[0.16em] text-[#d4af37] transition hover:text-[#F1E9DB]"
            >
              More in {post.category}
            </Link>
          </div>

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

          <BlogArticleTools title={post.title} url={articleUrl} />

          {post.image ? (
            <div className="relative mt-12 aspect-[21/9] overflow-hidden rounded-3xl border border-white/10">
              <Image
                src={post.image}
                alt={post.imageAlt || post.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
                quality={70}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          ) : null}

          <div className="mx-auto mt-12 grid max-w-5xl gap-10 border-t border-white/10 pt-12 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div id="blog-article-body" className="min-w-0">
              <BlogToc headings={headings} />

              {bodyHtml ? (
                <div
                  className="blog-prose space-y-6 text-lg leading-relaxed text-[#F1E9DB]/70"
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />
              ) : (
                <div className="space-y-6">
                  {post.body.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className="text-lg leading-relaxed text-[#F1E9DB]/70"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-6 border-l border-white/10 pl-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/40">
                    Reading
                  </p>
                  <p className="mt-2 text-sm text-[#F1E9DB]/65">{post.readTime}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/40">
                    Topic
                  </p>
                  <Link
                    href={`/insights?category=${encodeURIComponent(post.category)}`}
                    className="mt-2 inline-block text-sm text-[#d4af37] hover:underline"
                  >
                    {post.category}
                  </Link>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/40">
                    Explore
                  </p>
                  <ul className="mt-2 space-y-2 text-sm text-[#F1E9DB]/55">
                    <li>
                      <Link href="/technology/ai-photo-booths" className="hover:text-[#d4af37]">
                        AI Photo Booths
                      </Link>
                    </li>
                    <li>
                      <Link href="/digital-experiences" className="hover:text-[#d4af37]">
                        Digital Experiences
                      </Link>
                    </li>
                    <li>
                      <Link href="/solutions" className="hover:text-[#d4af37]">
                        Event Solutions
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="hover:text-[#d4af37]">
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>

          <aside className="mx-auto mt-12 max-w-5xl border-t border-white/10 pt-8 text-sm text-[#F1E9DB]/45">
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
          </aside>

          {related.length > 0 ? (
            <section
              aria-labelledby="related-posts"
              className="mx-auto mt-16 max-w-5xl border-t border-white/10 pt-12"
            >
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2
                  id="related-posts"
                  className="text-2xl font-semibold tracking-[-0.02em]"
                >
                  Keep reading
                </h2>
                <Link
                  href="/insights"
                  className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/45 transition hover:text-[#d4af37]"
                >
                  View all blogs
                </Link>
              </div>
              <ul className="mt-8 grid gap-6 md:grid-cols-3">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/insights/${item.slug}`} className="group block h-full">
                      {item.image ? (
                        <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl border border-white/10">
                          <Image
                            src={item.image}
                            alt={item.imageAlt || item.title}
                            fill
                            loading="lazy"
                            quality={65}
                            className="object-cover transition duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 30vw"
                          />
                        </div>
                      ) : null}
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#d4af37]">
                        {item.category}
                      </p>
                      <p className="mt-2 text-lg font-medium leading-snug transition group-hover:text-[#d4af37]">
                        {item.title}
                      </p>
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#F1E9DB]/40">
                        {item.readTime}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="mx-auto mt-16 max-w-5xl border-t border-white/10 pt-12">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-full border border-[#F1E9DB]/25 px-6 py-4 text-sm font-medium transition-all duration-300 hover:border-[#d4af37]/50 hover:bg-[#F1E9DB]/5 md:text-base"
            >
              Discuss your next event
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
