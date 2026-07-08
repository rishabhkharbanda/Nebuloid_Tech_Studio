'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Check } from 'lucide-react'
import { SectionReveal } from '@/components/site/section-reveal'
import { digitalProjects } from '@/lib/digital-data'
import { cn } from '@/lib/utils'

function FeatureList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d4af37]">{title}</p>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-[#F1E9DB]/70">
            <Check size={14} className="mt-0.5 shrink-0 text-[#d4af37]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function DigitalExperiencesSection() {
  return (
    <section id="digital-experiences" className="section-padding">
      <div className="content-grid">
        <SectionReveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            Digital Experiences
          </p>
          <h2 className="mt-4 max-w-5xl text-[clamp(2rem,5.5vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.03em]">
            Digital Experiences We&apos;ve Delivered
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#F1E9DB]/65 md:text-lg">
            From AI-powered event activations and interactive visitor engagement to
            enterprise websites and digital transformation, Nebuloid builds technology
            that creates memorable experiences.
          </p>
        </SectionReveal>

        <div className="mt-16 space-y-24 md:space-y-32">
          {digitalProjects.map((project, index) => {
            const isEven = index % 2 === 1
            const interactive =
              'interactiveExperiences' in project ? project.interactiveExperiences : undefined

            return (
              <SectionReveal key={project.slug} delay={index * 0.08}>
                <article
                  className={cn(
                    'group grid gap-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl md:gap-12 md:p-10 lg:grid-cols-12 lg:items-start',
                    'transition-all duration-500 hover:border-[#d4af37]/20 hover:bg-white/[0.05]',
                  )}
                >
                  <div
                    className={cn(
                      'relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 lg:col-span-5',
                      isEven && 'lg:order-2',
                    )}
                  >
                    <Image
                      src={project.image}
                      alt={project.client}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#d4af37]">
                        {project.client}
                      </p>
                      {'subtitle' in project && project.subtitle && (
                        <p className="mt-1 text-sm text-[#F1E9DB]/70">{project.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <div className={cn('lg:col-span-7', isEven && 'lg:order-1')}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#F1E9DB]/45">
                      {project.category}
                    </p>
                    <h3 className="mt-4 text-[clamp(1.5rem,3vw,2.5rem)] font-semibold leading-tight tracking-[-0.02em]">
                      {project.title}
                    </h3>
                    <p className="mt-5 leading-relaxed text-[#F1E9DB]/65">{project.overview}</p>

                    <div className="mt-8 grid gap-8 sm:grid-cols-2">
                      <FeatureList title="Our Contribution" items={project.contribution} />
                      <FeatureList title="Business Impact" items={project.impact} />
                    </div>

                    {interactive && 'games' in interactive && (
                      <div className="mt-8 grid gap-8 sm:grid-cols-2">
                        {'aiBooth' in interactive && (
                          <FeatureList title="AI Selfie Booth" items={interactive.aiBooth} />
                        )}
                        <FeatureList
                          title={'aiBooth' in interactive ? 'Interactive Games' : 'Interactive Games'}
                          items={interactive.games}
                        />
                        {'technologies' in interactive && (
                          <FeatureList
                            title="Interactive Technologies"
                            items={interactive.technologies}
                            />
                        )}
                      </div>
                    )}

                    <div className="mt-8">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d4af37]">
                        Technologies Used
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#F1E9DB]/60"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      href={`/digital-experiences/${project.slug}`}
                      className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#F1E9DB]/50 transition-all hover:gap-3 hover:text-[#d4af37]"
                    >
                      View Case Study
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </article>
              </SectionReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
