'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState, type ReactNode } from 'react'

function ViewportGate({
  children,
  minHeightClass,
  rootMargin = '280px 0px',
}: {
  children: ReactNode
  minHeightClass: string
  rootMargin?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || visible) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold: 0.01 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin, visible])

  return (
    <div ref={ref} className={visible ? undefined : minHeightClass}>
      {visible ? children : <div className={minHeightClass} aria-hidden />}
    </div>
  )
}

const TrustedBySection = dynamic(
  () =>
    import('@/components/site/trusted-by-section').then((mod) => mod.TrustedBySection),
  { loading: () => <div className="h-24" aria-hidden /> },
)

const ServicesSection = dynamic(
  () => import('@/components/site/services-section').then((mod) => mod.ServicesSection),
  { loading: () => <div className="min-h-[40vh]" aria-hidden /> },
)

const WorkSection = dynamic(
  () => import('@/components/site/work-section').then((mod) => mod.WorkSection),
  { loading: () => <div className="min-h-[50vh]" aria-hidden /> },
)

const DigitalExperiencesSection = dynamic(
  () =>
    import('@/components/site/digital-experiences-section').then(
      (mod) => mod.DigitalExperiencesSection,
    ),
  { loading: () => <div className="min-h-[50vh]" aria-hidden /> },
)

const AboutSection = dynamic(
  () => import('@/components/site/about-section').then((mod) => mod.AboutSection),
  { loading: () => <div className="min-h-[30vh]" aria-hidden /> },
)

const TestimonialsSection = dynamic(
  () =>
    import('@/components/site/testimonials-section').then((mod) => mod.TestimonialsSection),
  { loading: () => <div className="min-h-[40vh]" aria-hidden /> },
)

const BlogSection = dynamic(
  () => import('@/components/site/blog-section').then((mod) => mod.BlogSection),
  { loading: () => <div className="min-h-[30vh]" aria-hidden /> },
)

const FaqSection = dynamic(
  () => import('@/components/site/faq-section').then((mod) => mod.FaqSection),
  { loading: () => <div className="min-h-[30vh]" aria-hidden /> },
)

const DigitalCtaSection = dynamic(
  () =>
    import('@/components/site/digital-cta-section').then((mod) => mod.DigitalCtaSection),
  { loading: () => <div className="min-h-[30vh]" aria-hidden /> },
)

export function HomeBelowFold() {
  return (
    <div className="relative z-10 bg-[#090909]">
      <ViewportGate minHeightClass="h-24">
        <TrustedBySection />
      </ViewportGate>
      <ViewportGate minHeightClass="min-h-[40vh]">
        <ServicesSection limit={3} compact />
      </ViewportGate>
      <ViewportGate minHeightClass="min-h-[50vh]">
        <WorkSection limit={4} />
      </ViewportGate>
      <ViewportGate minHeightClass="min-h-[50vh]">
        <DigitalExperiencesSection variant="preview" />
      </ViewportGate>
      <ViewportGate minHeightClass="min-h-[30vh]">
        <AboutSection />
      </ViewportGate>
      <ViewportGate minHeightClass="min-h-[40vh]">
        <TestimonialsSection />
      </ViewportGate>
      <ViewportGate minHeightClass="min-h-[30vh]">
        <BlogSection limit={2} />
      </ViewportGate>
      <ViewportGate minHeightClass="min-h-[30vh]">
        <FaqSection limit={3} />
      </ViewportGate>
      <ViewportGate minHeightClass="min-h-[30vh]">
        <DigitalCtaSection />
      </ViewportGate>
    </div>
  )
}
