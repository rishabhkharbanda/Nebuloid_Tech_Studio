'use client'

import dynamic from 'next/dynamic'
import type { PublicDigitalCard } from '@/lib/content'
import type { PublicExperienceService } from '@/lib/cms/types'

const TrustedBySection = dynamic(
  () => import('@/components/site/trusted-by-section').then((m) => m.TrustedBySection),
  { ssr: true },
)
const ServicesSection = dynamic(
  () => import('@/components/site/services-section').then((m) => m.ServicesSection),
  { ssr: true },
)
const DigitalExperiencesSection = dynamic(
  () =>
    import('@/components/site/digital-experiences-section').then(
      (m) => m.DigitalExperiencesSection,
    ),
  { ssr: true },
)
const AboutSection = dynamic(
  () => import('@/components/site/about-section').then((m) => m.AboutSection),
  { ssr: true },
)
const TestimonialsSection = dynamic(
  () => import('@/components/site/testimonials-section').then((m) => m.TestimonialsSection),
  { ssr: true },
)
const BlogSection = dynamic(
  () => import('@/components/site/blog-section').then((m) => m.BlogSection),
  { ssr: true },
)
const FaqSection = dynamic(
  () => import('@/components/site/faq-section').then((m) => m.FaqSection),
  { ssr: true },
)
const DigitalCtaSection = dynamic(
  () => import('@/components/site/digital-cta-section').then((m) => m.DigitalCtaSection),
  { ssr: true },
)

type BlogCard = {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  readTime: string
  image?: string
  imageAlt?: string
}

/** Split below-fold client chunks so the hero JS payload stays smaller. */
export function HomeBelowFoldClient({
  blogPosts,
  digitalCards,
  experienceServices,
}: {
  blogPosts: BlogCard[]
  digitalCards: PublicDigitalCard[]
  experienceServices: PublicExperienceService[]
}) {
  return (
    <div className="relative z-10 bg-[#090909]">
      <TrustedBySection />
      <ServicesSection limit={3} compact services={experienceServices} />
      <DigitalExperiencesSection variant="preview" cards={digitalCards} />
      <AboutSection />
      <TestimonialsSection />
      <BlogSection limit={4} posts={blogPosts} />
      <FaqSection limit={3} />
      <DigitalCtaSection />
    </div>
  )
}
