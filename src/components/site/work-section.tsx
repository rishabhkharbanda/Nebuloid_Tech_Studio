'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { SectionReveal } from '@/components/site/section-reveal'
import { projects } from '@/lib/site-data'
import { cn } from '@/lib/utils'

export function WorkSection({ limit }: { limit?: number }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const visibleProjects = limit ? projects.slice(0, limit) : projects
  const activeProject = activeIndex !== null ? visibleProjects[activeIndex] : null

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
          <Link
            href="/experiences"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#F1E9DB]/50 transition-colors hover:text-[#d4af37]"
          >
            View all experiences
            <ArrowUpRight size={16} />
          </Link>
        </SectionReveal>

        <div className="relative mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="divide-y divide-white/10 border-y border-white/10 lg:col-span-7">
            {visibleProjects.map((project, index) => (
              <SectionReveal key={project.title} delay={index * 0.04}>
                <Link href={`/experiences/${project.slug}`} className="block">
                <article
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className={cn(
                    'group cursor-pointer py-8 transition-colors duration-300 md:py-10 lg:py-12',
                    activeIndex === index && 'bg-white/[0.02]',
                  )}
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="min-w-0">
                      <p
                        className={cn(
                          'font-mono text-xs uppercase tracking-[0.16em] transition-colors duration-300',
                          activeIndex === index ? 'text-[#d4af37]' : 'text-[#F1E9DB]/45',
                        )}
                      >
                        {String(index + 1).padStart(2, '0')} — {project.category}
                      </p>
                      <h3
                        className={cn(
                          'mt-3 text-[clamp(1.5rem,3.5vw,2.75rem)] font-semibold leading-tight tracking-[-0.02em] transition-colors duration-300',
                          activeIndex === index ? 'text-[#F1E9DB]' : 'text-[#F1E9DB]/75',
                        )}
                      >
                        {project.title}
                      </h3>
                      <p className="mt-3 text-sm text-[#F1E9DB]/50 md:text-base">
                        {project.tech}
                      </p>
                    </div>

                    <span
                      className={cn(
                        'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                        activeIndex === index
                          ? 'border-[#d4af37]/50 bg-[#d4af37]/10 text-[#d4af37]'
                          : 'border-white/10 text-[#F1E9DB]/30 group-hover:border-white/25 group-hover:text-[#F1E9DB]/60',
                      )}
                    >
                      <ArrowUpRight size={18} />
                    </span>
                  </div>

                  <AnimatePresence>
                    {activeIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden lg:hidden"
                      >
                        <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-2xl border border-white/10">
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover"
                            sizes="100vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
                </Link>
              </SectionReveal>
            ))}
          </div>

          <div className="pointer-events-none hidden lg:col-span-5 lg:block">
            <div className="sticky top-32">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c]">
                <AnimatePresence mode="wait">
                  {activeProject ? (
                    <motion.div
                      key={activeProject.title}
                      initial={{ opacity: 0, scale: 1.06 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={activeProject.image}
                        alt={activeProject.title}
                        fill
                        className="object-cover"
                        sizes="40vw"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-8">
                        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#d4af37]">
                          {activeProject.category}
                        </p>
                        <p className="mt-2 text-xl font-semibold text-[#F1E9DB]">
                          {activeProject.title}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#F1E9DB]/30">
                        Preview
                      </span>
                      <p className="max-w-[200px] text-sm leading-relaxed text-[#F1E9DB]/35">
                        Hover an experience to preview
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
