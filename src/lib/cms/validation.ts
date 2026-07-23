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
  displayDate: z.string().max(64).optional(),
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
})

export const reorderDigitalSchema = z.object({
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
