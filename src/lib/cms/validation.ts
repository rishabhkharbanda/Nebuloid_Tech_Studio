import { z } from 'zod'

const stringList = z.array(z.string().trim().min(1)).default([])

const galleryItemSchema = z.object({
  src: z.string().trim().min(1),
  alt: z.string().trim().default(''),
  label: z.string().trim().default(''),
})

const interactiveSchema = z
  .object({
    aiBooth: stringList.optional(),
    games: stringList.optional(),
    technologies: stringList.optional(),
  })
  .default({})

export const blogInputSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(512),
  slug: z.string().trim().max(255).optional(),
  excerpt: z.string().max(4000).optional(),
  body: z.string().optional(),
  bodyHtml: z.string().optional(),
  featuredImageUrl: z.string().optional(),
  featuredImageAlt: z.string().optional(),
  category: z.string().max(128).optional(),
  tags: z.array(z.string().trim().min(1)).optional(),
  status: z.enum(['draft', 'published', 'unpublished']).optional(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(4000).optional(),
  focusKeyword: z.string().max(128).optional(),
  canonicalPath: z.string().max(512).optional(),
  ogImageUrl: z.string().optional(),
  twitterImageUrl: z.string().optional(),
  robotsIndex: z.boolean().optional(),
  authorName: z.string().max(255).optional(),
  schemaType: z.string().max(64).optional(),
  displayDate: z.string().max(64).optional(),
})

export const blogBulkInputSchema = z.object({
  status: z.enum(['draft', 'published', 'unpublished']).optional(),
  category: z.string().max(128).optional(),
  posts: z.array(blogInputSchema).min(1, 'Add at least one post').max(50, 'Max 50 posts per upload'),
})

export const digitalCardInputSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(512),
  slug: z.string().trim().max(255).optional(),
  shortDescription: z.string().optional(),
  overview: z.string().optional(),
  subtitle: z.string().max(512).optional(),
  imageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
  iconUrl: z.string().optional(),
  ctaText: z.string().max(128).optional(),
  ctaHref: z.string().max(512).optional(),
  category: z.string().max(128).optional(),
  clientLabel: z.string().max(255).optional(),
  displayOrder: z.number().int().min(0).max(9999).optional(),
  enabled: z.boolean().optional(),
  status: z.enum(['draft', 'published', 'unpublished']).optional(),
  galleryTitle: z.string().max(255).optional(),
  galleryHeading: z.string().max(512).optional(),
  galleryAspect: z.enum(['wide', 'video']).optional().nullable(),
  gallery: z.array(galleryItemSchema).optional(),
  contribution: stringList.optional(),
  interactiveExperiences: interactiveSchema.optional(),
  techStack: stringList.optional(),
  impact: stringList.optional(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(4000).optional(),
  focusKeyword: z.string().max(128).optional(),
  canonicalPath: z.string().max(512).optional(),
  ogImageUrl: z.string().optional(),
  twitterImageUrl: z.string().optional(),
  robotsIndex: z.boolean().optional(),
  schemaType: z.string().max(64).optional(),
})

export const locationLandingInputSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(512),
  slug: z.string().trim().max(255).optional(),
  city: z.string().max(128).optional(),
  serviceLabel: z.string().max(255).optional(),
  heroIntro: z.string().optional(),
  whatIsIt: z.string().optional(),
  benefits: stringList.optional(),
  features: stringList.optional(),
  howItWorks: stringList.optional(),
  industries: stringList.optional(),
  useCases: stringList.optional(),
  whyChooseUs: stringList.optional(),
  faqs: z
    .array(
      z.object({
        question: z.string().trim().min(1),
        answer: z.string().trim().min(1),
      }),
    )
    .optional(),
  conclusion: z.string().optional(),
  relatedPaths: z
    .array(
      z.object({
        label: z.string().trim().min(1),
        href: z.string().trim().min(1),
      }),
    )
    .optional(),
  status: z.enum(['draft', 'published', 'unpublished']).optional(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(4000).optional(),
  focusKeyword: z.string().max(128).optional(),
  canonicalPath: z.string().max(512).optional(),
  ogImageUrl: z.string().optional(),
  twitterImageUrl: z.string().optional(),
  robotsIndex: z.boolean().optional(),
  schemaType: z.string().max(64).optional(),
})

export const locationLandingBulkInputSchema = z.object({
  status: z.enum(['draft', 'published', 'unpublished']).optional(),
  upsert: z.boolean().optional(),
  pages: z
    .array(locationLandingInputSchema)
    .min(1, 'Add at least one location landing')
    .max(25, 'Max 25 location landings per upload'),
})

export const reorderDigitalSchema = z.object({
  orderedIds: z.array(z.string().min(1)).min(1),
})

const detailSectionSchema = z.object({
  title: z.string().trim().min(1),
  content: z.string().trim().min(1),
})

export const experienceServiceInputSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(512),
  slug: z.string().trim().max(255).optional(),
  description: z.string().optional(),
  detail: z.string().optional(),
  tags: z.array(z.string().trim().min(1)).optional(),
  imageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
  intro: z.string().optional(),
  sections: z.array(detailSectionSchema).optional(),
  highlights: stringList.optional(),
  displayLabel: z.string().max(8).optional(),
  displayOrder: z.number().int().min(0).max(9999).optional(),
  enabled: z.boolean().optional(),
  status: z.enum(['draft', 'published', 'unpublished']).optional(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(4000).optional(),
  focusKeyword: z.string().max(128).optional(),
  canonicalPath: z.string().max(512).optional(),
  ogImageUrl: z.string().optional(),
  twitterImageUrl: z.string().optional(),
  robotsIndex: z.boolean().optional(),
  schemaType: z.string().max(64).optional(),
})

export const reorderExperienceServicesSchema = z.object({
  orderedIds: z.array(z.string().min(1)).min(1),
})

export const heroSlideInputSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(512),
  description: z.string().optional(),
  imageUrl: z.string().trim().min(1, 'Image URL is required'),
  imageAlt: z.string().optional(),
  overlayClasses: z.string().optional(),
  displayOrder: z.number().int().min(0).max(9999).optional(),
  enabled: z.boolean().optional(),
  status: z.enum(['draft', 'published', 'unpublished']).optional(),
})

export const reorderHeroSlidesSchema = z.object({
  orderedIds: z.array(z.string().min(1)).min(1),
})

export function parseWithZod<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join('; ')
    throw new Error(`VALIDATION: ${message || 'Invalid request body'}`)
  }
  return result.data
}

export function apiErrorStatus(error: unknown) {
  const message = error instanceof Error ? error.message : 'Error'
  if (message === 'UNAUTHORIZED') return { status: 401 as const, message }
  if (message === 'FORBIDDEN') return { status: 403 as const, message }
  if (message.startsWith('VALIDATION:')) {
    return { status: 400 as const, message: message.replace(/^VALIDATION:\s*/, '') }
  }
  return { status: 500 as const, message }
}
