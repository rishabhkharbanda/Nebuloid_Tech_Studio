'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SectionReveal } from '@/components/site/section-reveal'
import { services } from '@/lib/site-data'
import { cn } from '@/lib/utils'

export function ServicesSection({ limit, compact }: { limit?: number; compact?: boolean }) {
  const items = limit ? services.slice(0, limit) : services

  return (
    <section id="services" className="section-padding">
      <div className="content-grid">
        <SectionReveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            What We Create
          </p>
          <h2 className="mt-4 max-w-5xl text-[clamp(2rem,5.5vw,5.8rem)] font-bold leading-[0.95] tracking-[-0.03em] text-[#F1E9DB]">
            One event ecosystem. Every layer connected.
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#F1E9DB]/65 md:text-lg">
            Branding, technology, and production — unified into a single
            experience that attendees feel from invitation to encore.
          </p>
          <Link
            href="/solutions"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#F1E9DB]/50 transition-colors hover:text-[#d4af37]"
          >
            View all solutions
            <ArrowUpRight size={16} />
          </Link>
        </SectionReveal>

        <div className="mt-14 divide-y divide-white/10 border-y border-white/10">
          {items.map((service, index) => {
            const isEven = index % 2 === 1

            return (
              <SectionReveal key={service.id} delay={index * 0.06}>
                <Link
                  href={`/solutions/${service.slug}`}
                  className="group block outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909]"
                >
                  <article
                    className={cn(
                      'grid gap-8 py-10 transition-transform duration-500 ease-[cubic-bezier(0.2,0.65,0.3,0.9)] md:grid-cols-12 md:items-center md:gap-10 md:py-12 lg:py-14',
                      'motion-safe:group-hover:translate-x-1',
                      isEven && 'motion-safe:group-hover:-translate-x-1',
                    )}
                  >
                    <span
                      className={cn(
                        'text-display-filled text-[clamp(3rem,8vw,6rem)] leading-none text-[#F1E9DB]/15 transition-colors duration-500 group-hover:text-[#d4af37] md:col-span-2',
                        isEven && 'md:order-3 md:text-right',
                      )}
                    >
                      {service.id}
                    </span>

                    <div
                      className={cn(
                        'md:col-span-4 lg:col-span-5',
                        isEven ? 'md:order-2' : 'md:order-2',
                      )}
                    >
                      <h3 className="text-display-filled text-[clamp(2rem,4.5vw,3.8rem)] leading-[0.92] tracking-[0.02em] text-[#F1E9DB] transition-colors duration-500 group-hover:text-[#F1E9DB]">
                        {service.title}
                      </h3>
                      <p className="mt-5 max-w-lg text-base leading-relaxed text-[#F1E9DB]/65 md:text-lg">
                        {service.description}
                      </p>
                      {!compact && (
                        <>
                          <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#F1E9DB]/50 md:text-base">
                            {service.detail}
                          </p>

                          <div className="mt-6 flex flex-wrap gap-2">
                            {service.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#F1E9DB]/55 transition-colors duration-300 group-hover:border-[#d4af37]/35 group-hover:text-[#F1E9DB]/80"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </>
                      )}

                      <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#F1E9DB]/50 transition-all duration-300 group-hover:gap-3 group-hover:text-[#d4af37]">
                        Explore Layer
                        <ArrowUpRight
                          size={16}
                          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>

                    <div
                      className={cn(
                        'relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c] transition-[border-color,box-shadow] duration-500 group-hover:border-[#d4af37]/35 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)] md:col-span-6 lg:col-span-5',
                        isEven ? 'md:order-1' : 'md:order-3',
                      )}
                    >
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover grayscale transition-[transform,filter] duration-700 ease-out will-change-transform group-hover:scale-105 group-hover:grayscale-0"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-35" />
                    </div>
                  </article>
                </Link>
              </SectionReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
