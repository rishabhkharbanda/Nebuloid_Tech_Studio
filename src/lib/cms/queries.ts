import { asc, desc, eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { getDb, hasDatabase } from '@/db/client'
import {
  blogPostsCms,
  digitalExperienceCards,
  mediaAssets,
  type BlogPostCms,
  type DigitalExperienceCard,
  type MediaAsset,
} from '@/db/schema'
import { bodyToParagraphs, estimateReadTime, slugify } from '@/lib/cms/seo-analyzer'
import type { PublicDigitalProject } from '@/lib/cms/types'

export function cmsEnabled() {
  return hasDatabase()
}

export async function listBlogPostsCms() {
  if (!cmsEnabled()) return [] as BlogPostCms[]
  const db = getDb()
  return db.select().from(blogPostsCms).orderBy(desc(blogPostsCms.updatedAt))
}

export async function getBlogPostCmsById(id: string) {
  if (!cmsEnabled()) return null
  const db = getDb()
  const [row] = await db.select().from(blogPostsCms).where(eq(blogPostsCms.id, id)).limit(1)
  return row ?? null
}

export async function getPublishedBlogPostsCms() {
  if (!cmsEnabled()) return [] as BlogPostCms[]
  const db = getDb()
  return db
    .select()
    .from(blogPostsCms)
    .where(eq(blogPostsCms.status, 'published'))
    .orderBy(desc(blogPostsCms.publishedAt), desc(blogPostsCms.updatedAt))
}

export async function getPublishedBlogBySlug(slug: string) {
  if (!cmsEnabled()) return null
  const db = getDb()
  const [row] = await db
    .select()
    .from(blogPostsCms)
    .where(eq(blogPostsCms.slug, slug))
    .limit(1)
  if (!row || row.status !== 'published') return null
  return row
}

export type BlogInput = {
  title: string
  slug?: string
  excerpt?: string
  body?: string
  bodyHtml?: string
  featuredImageUrl?: string
  featuredImageAlt?: string
  category?: string
  tags?: string[]
  status?: 'draft' | 'published' | 'unpublished'
  metaTitle?: string
  metaDescription?: string
  focusKeyword?: string
  displayDate?: string
  createdBy?: string
}

function nextPreviewToken(existing?: string | null) {
  return existing && existing.length >= 16 ? existing : nanoid(24)
}

function resolvePublishedAt(
  status: 'draft' | 'published' | 'unpublished',
  previous: Date | null | undefined,
  now: Date,
) {
  if (status === 'published') return previous ?? now
  if (status === 'unpublished') return null
  return previous ?? null
}

export async function upsertBlogPostCms(id: string | null, input: BlogInput) {
  const db = getDb()
  const now = new Date()
  const slug = slugify(input.slug || input.title)
  const body = input.body ?? ''
  const status = input.status ?? 'draft'
  const existing = id ? await getBlogPostCmsById(id) : null
  const values = {
    slug,
    title: input.title.trim(),
    excerpt: input.excerpt?.trim() ?? '',
    body,
    bodyHtml: input.bodyHtml ?? body,
    featuredImageUrl: input.featuredImageUrl ?? '',
    featuredImageAlt: input.featuredImageAlt ?? '',
    category: input.category?.trim() ?? '',
    tags: input.tags ?? [],
    status,
    metaTitle: input.metaTitle?.trim() ?? '',
    metaDescription: input.metaDescription?.trim() ?? '',
    focusKeyword: input.focusKeyword?.trim() ?? '',
    readTime: estimateReadTime(body),
    displayDate:
      input.displayDate?.trim() ||
      existing?.displayDate ||
      now.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
    previewToken: nextPreviewToken(existing?.previewToken),
    updatedAt: now,
    publishedAt: resolvePublishedAt(status, existing?.publishedAt, now),
  }

  if (id) {
    const [row] = await db
      .update(blogPostsCms)
      .set(values)
      .where(eq(blogPostsCms.id, id))
      .returning()
    return row
  }

  const [row] = await db
    .insert(blogPostsCms)
    .values({
      id: nanoid(),
      ...values,
      createdAt: now,
      createdBy: input.createdBy ?? null,
    })
    .returning()
  return row
}

export async function getBlogByPreviewToken(slug: string, token: string) {
  if (!cmsEnabled() || !token) return null
  const db = getDb()
  const [row] = await db.select().from(blogPostsCms).where(eq(blogPostsCms.slug, slug)).limit(1)
  if (!row || row.previewToken !== token) return null
  return row
}

export async function deleteBlogPostCms(id: string) {
  const db = getDb()
  await db.delete(blogPostsCms).where(eq(blogPostsCms.id, id))
}

export function mapCmsBlogToPublic(post: BlogPostCms) {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.displayDate || post.publishedAt?.toLocaleString('en-US', { month: 'long', year: 'numeric' }) || '',
    category: post.category,
    readTime: post.readTime,
    image: post.featuredImageUrl,
    imageAlt: post.featuredImageAlt,
    metaTitle: post.metaTitle || post.title,
    metaDescription: post.metaDescription || post.excerpt,
    body: bodyToParagraphs(post.bodyHtml || post.body),
    bodyHtml: post.bodyHtml || '',
  }
}

export async function listMediaAssets(folder?: string) {
  if (!cmsEnabled()) return [] as MediaAsset[]
  const db = getDb()
  if (folder) {
    return db
      .select()
      .from(mediaAssets)
      .where(eq(mediaAssets.folder, folder))
      .orderBy(desc(mediaAssets.createdAt))
  }
  return db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt))
}

export async function createMediaAsset(input: {
  url: string
  pathname: string
  filename: string
  alt?: string
  mimeType?: string
  size?: number
  width?: number | null
  height?: number | null
  folder?: string
}) {
  const db = getDb()
  const [row] = await db
    .insert(mediaAssets)
    .values({
      id: nanoid(),
      url: input.url,
      pathname: input.pathname,
      filename: input.filename,
      alt: input.alt ?? '',
      mimeType: input.mimeType ?? 'image/jpeg',
      size: input.size ?? 0,
      width: input.width ?? null,
      height: input.height ?? null,
      folder: input.folder ?? 'general',
    })
    .returning()
  return row
}

export async function updateMediaAsset(
  id: string,
  input: Partial<{ alt: string; folder: string; filename: string }>,
) {
  const db = getDb()
  const [row] = await db
    .update(mediaAssets)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(mediaAssets.id, id))
    .returning()
  return row
}

export async function deleteMediaAsset(id: string) {
  const db = getDb()
  const [row] = await db.delete(mediaAssets).where(eq(mediaAssets.id, id)).returning()
  return row ?? null
}

export async function listDigitalCardsCms(includeDisabled = true) {
  if (!cmsEnabled()) return [] as DigitalExperienceCard[]
  const db = getDb()
  const rows = await db
    .select()
    .from(digitalExperienceCards)
    .orderBy(asc(digitalExperienceCards.displayOrder), desc(digitalExperienceCards.updatedAt))
  if (includeDisabled) return rows
  return rows.filter((row) => row.enabled && row.status === 'published')
}

export async function getDigitalCardCmsById(id: string) {
  if (!cmsEnabled()) return null
  const db = getDb()
  const [row] = await db
    .select()
    .from(digitalExperienceCards)
    .where(eq(digitalExperienceCards.id, id))
    .limit(1)
  return row ?? null
}

export async function getPublishedDigitalBySlug(slug: string) {
  if (!cmsEnabled()) return null
  const db = getDb()
  const [row] = await db
    .select()
    .from(digitalExperienceCards)
    .where(eq(digitalExperienceCards.slug, slug))
    .limit(1)
  if (!row || !row.enabled || row.status !== 'published') return null
  return row
}

export async function getDigitalByPreviewToken(slug: string, token: string) {
  if (!cmsEnabled() || !token) return null
  const db = getDb()
  const [row] = await db
    .select()
    .from(digitalExperienceCards)
    .where(eq(digitalExperienceCards.slug, slug))
    .limit(1)
  if (!row || row.previewToken !== token) return null
  return row
}

export type DigitalCardInput = {
  title: string
  slug?: string
  shortDescription?: string
  overview?: string
  subtitle?: string
  imageUrl?: string
  imageAlt?: string
  iconUrl?: string
  ctaText?: string
  ctaHref?: string
  category?: string
  clientLabel?: string
  displayOrder?: number
  enabled?: boolean
  status?: 'draft' | 'published' | 'unpublished'
  galleryTitle?: string
  galleryHeading?: string
  galleryAspect?: 'wide' | 'video' | null
  gallery?: Array<{ src: string; alt: string; label: string }>
  contribution?: string[]
  interactiveExperiences?: {
    aiBooth?: string[]
    games?: string[]
    technologies?: string[]
  }
  techStack?: string[]
  impact?: string[]
  metaTitle?: string
  metaDescription?: string
}

export function mapCmsDigitalToPublic(card: DigitalExperienceCard): PublicDigitalProject {
  const overview = card.overview || card.shortDescription
  const aspect =
    card.galleryAspect === 'wide' || card.galleryAspect === 'video'
      ? card.galleryAspect
      : undefined
  return {
    slug: card.slug,
    client: card.clientLabel || card.category,
    subtitle: card.subtitle || undefined,
    category: card.category,
    title: card.title,
    overview,
    image: card.imageUrl,
    galleryTitle: card.galleryTitle || undefined,
    galleryHeading: card.galleryHeading || undefined,
    galleryAspect: aspect,
    gallery: [...(card.gallery ?? [])],
    contribution: [...(card.contribution ?? [])],
    interactiveExperiences: card.interactiveExperiences
      ? {
          aiBooth: card.interactiveExperiences.aiBooth
            ? [...card.interactiveExperiences.aiBooth]
            : undefined,
          games: card.interactiveExperiences.games
            ? [...card.interactiveExperiences.games]
            : undefined,
          technologies: card.interactiveExperiences.technologies
            ? [...card.interactiveExperiences.technologies]
            : undefined,
        }
      : undefined,
    techStack: [...(card.techStack ?? [])],
    impact: [...(card.impact ?? [])],
  }
}

export async function upsertDigitalCardCms(id: string | null, input: DigitalCardInput) {
  const db = getDb()
  const now = new Date()
  const existing = id ? await getDigitalCardCmsById(id) : null
  const status = input.status ?? existing?.status ?? 'draft'
  const shortDescription = input.shortDescription?.trim() ?? existing?.shortDescription ?? ''
  const overview = input.overview?.trim() || shortDescription
  const slug = slugify(input.slug || input.title)
  const values = {
    slug,
    title: input.title.trim(),
    shortDescription: shortDescription || overview,
    overview,
    subtitle: input.subtitle?.trim() ?? existing?.subtitle ?? '',
    imageUrl: input.imageUrl ?? existing?.imageUrl ?? '',
    imageAlt: input.imageAlt ?? existing?.imageAlt ?? '',
    iconUrl: input.iconUrl ?? existing?.iconUrl ?? '',
    ctaText: input.ctaText?.trim() || existing?.ctaText || 'View Case Study',
    ctaHref: input.ctaHref?.trim() || existing?.ctaHref || `/digital-experiences/${slug}`,
    category: input.category?.trim() ?? existing?.category ?? '',
    clientLabel: input.clientLabel?.trim() ?? existing?.clientLabel ?? '',
    displayOrder: input.displayOrder ?? existing?.displayOrder ?? 0,
    enabled: input.enabled ?? existing?.enabled ?? true,
    status,
    galleryTitle: input.galleryTitle?.trim() ?? existing?.galleryTitle ?? '',
    galleryHeading: input.galleryHeading?.trim() ?? existing?.galleryHeading ?? '',
    galleryAspect: input.galleryAspect === null ? '' : (input.galleryAspect ?? existing?.galleryAspect ?? ''),
    gallery: input.gallery ?? existing?.gallery ?? [],
    contribution: input.contribution ?? existing?.contribution ?? [],
    interactiveExperiences: input.interactiveExperiences ?? existing?.interactiveExperiences ?? {},
    techStack: input.techStack ?? existing?.techStack ?? [],
    impact: input.impact ?? existing?.impact ?? [],
    metaTitle: input.metaTitle?.trim() ?? existing?.metaTitle ?? '',
    metaDescription: input.metaDescription?.trim() ?? existing?.metaDescription ?? '',
    previewToken: nextPreviewToken(existing?.previewToken),
    publishedAt: resolvePublishedAt(
      status as 'draft' | 'published' | 'unpublished',
      existing?.publishedAt,
      now,
    ),
    updatedAt: now,
  }

  if (id) {
    const [row] = await db
      .update(digitalExperienceCards)
      .set(values)
      .where(eq(digitalExperienceCards.id, id))
      .returning()
    return row
  }

  const [row] = await db
    .insert(digitalExperienceCards)
    .values({
      id: nanoid(),
      ...values,
      createdAt: now,
    })
    .returning()
  return row
}

export async function deleteDigitalCardCms(id: string) {
  const db = getDb()
  await db.delete(digitalExperienceCards).where(eq(digitalExperienceCards.id, id))
}

export async function reorderDigitalCardsCms(orderedIds: string[]) {
  const db = getDb()
  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(digitalExperienceCards)
        .set({ displayOrder: index, updatedAt: new Date() })
        .where(eq(digitalExperienceCards.id, id)),
    ),
  )
}
