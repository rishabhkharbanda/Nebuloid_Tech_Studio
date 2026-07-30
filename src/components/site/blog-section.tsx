'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { SectionReveal } from '@/components/site/section-reveal'
import { StretchLink } from '@/components/site/stretch-link'
import { resolveBlogImage, resolveBlogImageAlt } from '@/lib/blog-image'
import { blogPosts } from '@/lib/site-data'

type BlogListItem = {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  readTime: string
  image?: string
  imageAlt?: string
}

export function BlogSection({
  limit,
  posts,
}: {
  limit?: number
  posts?: BlogListItem[]
}) {
  const source: BlogListItem[] = posts ?? [...blogPosts]
  const list = limit ? source.slice(0, limit) : source
  const [featured, ...rest] = list

  if (!featured) return null

  return (
    <section id="insights" className="section-padding">
      <div className="content-grid">
        <SectionReveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
                Blogs
              </p>
              <h2 className="mt-4 max-w-3xl text-[clamp(2rem,4.5vw,4rem)] font-bold leading-tight tracking-[-0.03em] text-[#F1E9DB]">
                Thinking on events, experience, and creative technology.
              </h2>
            </div>
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#F1E9DB]/50 transition-colors hover:text-[#d4af37]"
            >
              View all blogs
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </SectionReveal>

        <div className="mt-14 border-y border-white/10">
          <SectionReveal delay={0.05}>
            <motion.article
              whileHover={{ x: 4 }}
              transition={{ duration: 0.4, ease: [0.2, 0.65, 0.3, 0.9] }}
              className="group relative grid cursor-pointer gap-8 border-b border-white/10 py-12 md:grid-cols-12 md:items-center md:gap-12 md:py-16"
            >
              <StretchLink href={`/insights/${featured.slug}`} label="Read featured blog article" />
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 md:col-span-5">
                <Image
                  src={resolveBlogImage(featured.image)}
                  alt={resolveBlogImageAlt(featured.image, featured.imageAlt, featured.title)}
                  fill
                  loading="lazy"
                  quality={65}
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              </div>

              <div className="md:col-span-7">
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-[#F1E9DB]/50">
                  <span className="text-[#d4af37]">Featured</span>
                  <span>·</span>
                  <span>{featured.category}</span>
                  <span>·</span>
                  <span>{featured.date}</span>
                  <span>·</span>
                  <span>{featured.readTime}</span>
                </div>

                <h3 className="mt-6 max-w-4xl text-display-filled text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.92] tracking-[0.02em] text-[#F1E9DB] transition-colors duration-300 group-hover:text-[#d4af37]">
                  {featured.title}
                </h3>

                <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#F1E9DB]/65 md:text-lg">
                  {featured.excerpt}
                </p>

                <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#F1E9DB]/50 transition-all duration-300 group-hover:gap-3 group-hover:text-[#d4af37]">
                  Read story
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </motion.article>
          </SectionReveal>

          <div className="divide-y divide-white/10">
            {rest.map((post, index) => (
              <SectionReveal key={post.slug || post.title} delay={0.1 + index * 0.06}>
                <motion.article
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.4, ease: [0.2, 0.65, 0.3, 0.9] }}
                  className="group relative grid cursor-pointer gap-6 py-10 md:grid-cols-12 md:items-center md:gap-10 md:py-12"
                >
                  <StretchLink
                    href={`/insights/${post.slug}`}
                    label={`Read ${post.category} blog article`}
                  />
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 md:col-span-3 md:aspect-[4/3]">
                    <Image
                      src={resolveBlogImage(post.image)}
                      alt={resolveBlogImageAlt(post.image, post.imageAlt, post.title)}
                      fill
                      loading="lazy"
                      quality={65}
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 20vw"
                    />
                  </div>

                  <div className="md:col-span-8">
                    {post.image ? (
                      <div className="mb-3 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#F1E9DB]/45">
                        <span className="text-[#d4af37]">{post.category}</span>
                        <span>·</span>
                        <span>{post.date}</span>
                        <span>·</span>
                        <span>{post.readTime}</span>
                      </div>
                    ) : null}
                    <h4 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-[#F1E9DB] transition-colors duration-300 group-hover:text-[#d4af37] md:text-3xl">
                      {post.title}
                    </h4>
                    <p className="mt-4 max-w-2xl text-[#F1E9DB]/60">{post.excerpt}</p>
                  </div>

                  <div className="flex md:col-span-1 md:justify-end">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-[#F1E9DB]/40 transition-all duration-300 group-hover:border-[#d4af37]/50 group-hover:text-[#d4af37]">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                </motion.article>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
