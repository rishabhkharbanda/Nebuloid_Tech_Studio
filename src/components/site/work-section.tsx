'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { SectionReveal } from '@/components/site/section-reveal'
import { projects } from '@/lib/site-data'
import { cn } from '@/lib/utils'

export function WorkSection() {
  return (
    <section id="work" className="section-padding">
      <div className="content-grid">
        <SectionReveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            Featured Experiences
          </p>
          <h2 className="mt-4 max-w-4xl text-[clamp(2rem,5vw,5.2rem)] font-bold leading-tight tracking-[-0.03em]">
            Moments we designed, built, and brought to life.
          </h2>
        </SectionReveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <SectionReveal
              key={project.title}
              delay={index * 0.06}
              className={cn('h-full', project.span)}
            >
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, ease: [0.2, 0.65, 0.3, 0.9] }}
                className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c]"
              >
                <div className={cn('relative w-full overflow-hidden', project.aspect)}>
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#d4af37]">
                    {project.category}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[#F1E9DB] md:text-2xl">
                    {project.title}
                  </h3>
                  <div className="mt-3 flex items-center justify-between gap-4 text-sm text-[#F1E9DB]/75">
                    <span>{project.tech}</span>
                    <span className="inline-flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      View Experience <ArrowUpRight size={15} />
                    </span>
                  </div>
                </div>
              </motion.article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
