'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import {
  BarChart3,
  Bot,
  Cpu,
  Gamepad2,
  Globe,
  Layers,
  Layout,
  Monitor,
  QrCode,
  Sparkles,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionReveal } from '@/components/site/section-reveal'
import { digitalCapabilities } from '@/lib/digital-data'
import { cn } from '@/lib/utils'

const iconMap: Record<string, LucideIcon> = {
  'interactive-experience-platforms': Layers,
  'ai-selfie-booths': Bot,
  'ai-powered-visitor-experiences': Sparkles,
  'interactive-gaming-solutions': Gamepad2,
  'touchscreen-kiosks': Monitor,
  'website-design-development': Globe,
  'government-digital-platforms': Layout,
  'event-technology': Zap,
  'digital-storytelling': Sparkles,
  'visitor-engagement-systems': Monitor,
  'qr-code-experiences': QrCode,
  'analytics-dashboards': BarChart3,
  'cms-development': Layout,
  'api-integrations': Cpu,
  'performance-optimization': Zap,
}

type DigitalSolutionsSectionProps = {
  limit?: number
  showViewAll?: boolean
}

function CapabilityCard({
  capability,
  index,
  featured = false,
}: {
  capability: (typeof digitalCapabilities)[number]
  index: number
  featured?: boolean
}) {
  const Icon = iconMap[capability.slug] ?? Layers

  return (
    <SectionReveal delay={index * 0.05}>
      <Link href={capability.href} className="group block h-full">
        <motion.article
          whileHover={{ y: -6 }}
          transition={{ duration: 0.4, ease: [0.2, 0.65, 0.3, 0.9] }}
          className={cn(
            'relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white/[0.04] p-6 backdrop-blur-xl transition-colors duration-500 md:p-8',
            featured
              ? 'border-[#d4af37]/20 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.08),transparent_55%)] hover:border-[#d4af37]/35 hover:bg-white/[0.06]'
              : 'border-white/10 hover:border-[#d4af37]/25 hover:bg-white/[0.07]',
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10 text-[#d4af37] transition-colors group-hover:border-[#d4af37]/40 group-hover:bg-[#d4af37]/15">
              <Icon size={22} />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#F1E9DB]/35">
              {capability.id}
            </span>
          </div>

          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-[#d4af37]/80">
            {capability.category}
          </p>
          <h3
            className={cn(
              'mt-3 font-semibold tracking-[-0.02em] text-[#F1E9DB] transition-colors group-hover:text-[#d4af37]',
              featured ? 'text-xl md:text-2xl' : 'text-lg',
            )}
          >
            {capability.title}
          </h3>
          <p
            className={cn(
              'mt-3 flex-1 leading-relaxed text-[#F1E9DB]/60',
              featured ? 'text-sm md:text-base' : 'text-sm',
            )}
          >
            {capability.description}
          </p>

          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#F1E9DB]/45 transition-all group-hover:gap-3 group-hover:text-[#d4af37]">
            Learn more
            <ArrowUpRight size={16} />
          </span>
        </motion.article>
      </Link>
    </SectionReveal>
  )
}

export function DigitalSolutionsSection({
  limit,
  showViewAll = true,
}: DigitalSolutionsSectionProps) {
  const items = limit ? digitalCapabilities.slice(0, limit) : digitalCapabilities
  const featuredItems = items.filter((item) => item.featured)
  const regularItems = items.filter((item) => !item.featured)

  return (
    <section id="digital-solutions" className="section-padding border-y border-white/10">
      <div className="content-grid">
        <SectionReveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            Capabilities
          </p>
          <h2 className="mt-4 max-w-4xl text-[clamp(2rem,5vw,5rem)] font-bold leading-tight tracking-[-0.03em]">
            Our Digital Experience Solutions
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#F1E9DB]/65 md:text-lg">
            From AI-powered activations and interactive gaming to government platforms
            and enterprise websites — we engineer the technology behind memorable
            digital experiences.
          </p>
          {showViewAll && (
            <Link
              href="/capabilities"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#F1E9DB]/50 transition-colors hover:text-[#d4af37]"
            >
              Explore all capabilities
              <ArrowUpRight size={16} />
            </Link>
          )}
        </SectionReveal>

        {featuredItems.length > 0 && (
          <div className="mt-14 grid gap-4 lg:grid-cols-2">
            {featuredItems.map((capability, index) => (
              <CapabilityCard
                key={capability.slug}
                capability={capability}
                index={index}
                featured
              />
            ))}
          </div>
        )}

        <div
          className={cn(
            'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
            featuredItems.length > 0 ? 'mt-4' : 'mt-14',
          )}
        >
          {regularItems.map((capability, index) => (
            <CapabilityCard
              key={capability.slug}
              capability={capability}
              index={featuredItems.length + index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
