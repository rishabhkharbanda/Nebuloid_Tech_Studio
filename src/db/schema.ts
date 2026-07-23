import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

export const adminUsers = pgTable('admin_users', {
  id: text('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 32 }).notNull().default('editor'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const mediaAssets = pgTable('media_assets', {
  id: text('id').primaryKey(),
  url: text('url').notNull(),
  pathname: text('pathname').notNull(),
  filename: varchar('filename', { length: 512 }).notNull(),
  alt: text('alt').notNull().default(''),
  mimeType: varchar('mime_type', { length: 128 }).notNull().default('image/jpeg'),
  size: integer('size').notNull().default(0),
  width: integer('width'),
  height: integer('height'),
  folder: varchar('folder', { length: 128 }).notNull().default('general'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type GalleryItemRow = {
  src: string
  alt: string
  label: string
}

export type InteractiveExperiencesRow = {
  aiBooth?: string[]
  games?: string[]
  technologies?: string[]
}

export const blogPostsCms = pgTable('blog_posts', {
  id: text('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 512 }).notNull(),
  excerpt: text('excerpt').notNull().default(''),
  body: text('body').notNull().default(''),
  bodyHtml: text('body_html').notNull().default(''),
  featuredImageUrl: text('featured_image_url').notNull().default(''),
  featuredImageAlt: text('featured_image_alt').notNull().default(''),
  category: varchar('category', { length: 128 }).notNull().default(''),
  tags: jsonb('tags').$type<string[]>().notNull().default([]),
  status: varchar('status', { length: 32 }).notNull().default('draft'),
  metaTitle: varchar('meta_title', { length: 255 }).notNull().default(''),
  metaDescription: text('meta_description').notNull().default(''),
  focusKeyword: varchar('focus_keyword', { length: 128 }).notNull().default(''),
  readTime: varchar('read_time', { length: 64 }).notNull().default('5 min read'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  displayDate: varchar('display_date', { length: 64 }).notNull().default(''),
  previewToken: varchar('preview_token', { length: 64 }).notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  createdBy: text('created_by'),
})

export const digitalExperienceCards = pgTable('digital_experience_cards', {
  id: text('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 512 }).notNull(),
  shortDescription: text('short_description').notNull().default(''),
  overview: text('overview').notNull().default(''),
  subtitle: varchar('subtitle', { length: 512 }).notNull().default(''),
  imageUrl: text('image_url').notNull().default(''),
  imageAlt: text('image_alt').notNull().default(''),
  iconUrl: text('icon_url').notNull().default(''),
  ctaText: varchar('cta_text', { length: 128 }).notNull().default('View Case Study'),
  ctaHref: varchar('cta_href', { length: 512 }).notNull().default(''),
  category: varchar('category', { length: 128 }).notNull().default(''),
  clientLabel: varchar('client_label', { length: 255 }).notNull().default(''),
  displayOrder: integer('display_order').notNull().default(0),
  enabled: boolean('enabled').notNull().default(true),
  status: varchar('status', { length: 32 }).notNull().default('draft'),
  galleryTitle: varchar('gallery_title', { length: 255 }).notNull().default(''),
  galleryHeading: varchar('gallery_heading', { length: 512 }).notNull().default(''),
  galleryAspect: varchar('gallery_aspect', { length: 32 }).notNull().default(''),
  gallery: jsonb('gallery').$type<GalleryItemRow[]>().notNull().default([]),
  contribution: jsonb('contribution').$type<string[]>().notNull().default([]),
  interactiveExperiences: jsonb('interactive_experiences')
    .$type<InteractiveExperiencesRow>()
    .notNull()
    .default({}),
  techStack: jsonb('tech_stack').$type<string[]>().notNull().default([]),
  impact: jsonb('impact').$type<string[]>().notNull().default([]),
  metaTitle: varchar('meta_title', { length: 255 }).notNull().default(''),
  metaDescription: text('meta_description').notNull().default(''),
  previewToken: varchar('preview_token', { length: 64 }).notNull().default(''),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type AdminUser = typeof adminUsers.$inferSelect
export type MediaAsset = typeof mediaAssets.$inferSelect
export type BlogPostCms = typeof blogPostsCms.$inferSelect
export type DigitalExperienceCard = typeof digitalExperienceCards.$inferSelect
