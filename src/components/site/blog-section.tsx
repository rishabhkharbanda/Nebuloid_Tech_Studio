'use client'

import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { SectionReveal } from '@/components/site/section-reveal'
import { blogPosts } from '@/lib/site-data'

export function BlogSection() {
  const [featured, ...rest] = blogPosts

  return (
    <section className="section-padding">
      <div className="content-grid">
        <SectionReveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            Insights
          </p>
          <h2 className="mt-4 max-w-3xl text-[clamp(2rem,4.5vw,4rem)] font-bold leading-tight tracking-[-0.03em] text-[#F1E9DB]">
            Thinking on events, experience, and creative technology.
          </h2>
        </SectionReveal>

        <div className="mt-14 border-y border-white/10">
          {/* Featured article */}
          <SectionReveal delay={0.05}>
            <motion.article
              whileHover={{ x: 4 }}
              transition={{ duration: 0.4, ease: [0.2, 0.65, 0.3, 0.9] }}
              className="group cursor-pointer border-b border-white/10 py-12 md:py-16"
            >
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
                Read Story
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </motion.article>
          </SectionReveal>

          {/* Secondary articles */}
          <div className="divide-y divide-white/10">
            {rest.map((post, index) => (
              <SectionReveal key={post.title} delay={0.1 + index * 0.06}>
                <motion.article
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.4, ease: [0.2, 0.65, 0.3, 0.9] }}
                  className="group grid cursor-pointer gap-6 py-10 md:grid-cols-12 md:items-start md:gap-10 md:py-12"
                >
                  <div className="md:col-span-3">
                    <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#F1E9DB]/45">
                      {post.date}
                    </p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#d4af37]/80">
                      {post.category}
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#F1E9DB]/40">
                      {post.readTime}
                    </p>
                  </div>

                  <div className="md:col-span-8">
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
