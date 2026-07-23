import { AboutSection } from '@/components/site/about-section'
import { BlogSection } from '@/components/site/blog-section'
import { DigitalCtaSection } from '@/components/site/digital-cta-section'
import { DigitalExperiencesSection } from '@/components/site/digital-experiences-section'
import { FaqSection } from '@/components/site/faq-section'
import { ServicesSection } from '@/components/site/services-section'
import { TestimonialsSection } from '@/components/site/testimonials-section'
import { TrustedBySection } from '@/components/site/trusted-by-section'
import { WorkSection } from '@/components/site/work-section'
import { getBlogPostsForListing, getDigitalExperienceCards } from '@/lib/content'

export async function HomeBelowFold() {
  const [blogPosts, digitalCards] = await Promise.all([
    getBlogPostsForListing(),
    getDigitalExperienceCards(),
  ])

  return (
    <div className="relative z-10 bg-[#090909]">
      <TrustedBySection />
      <ServicesSection limit={3} compact />
      <WorkSection limit={4} />
      <DigitalExperiencesSection variant="preview" cards={digitalCards} />
      <AboutSection />
      <TestimonialsSection />
      <BlogSection
        limit={2}
        posts={blogPosts.map((post) => ({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          date: post.date,
          category: post.category,
          readTime: post.readTime,
        }))}
      />
      <FaqSection limit={3} />
      <DigitalCtaSection />
    </div>
  )
}
