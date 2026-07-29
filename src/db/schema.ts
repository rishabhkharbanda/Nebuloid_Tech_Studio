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
  canonicalPath: varchar('canonical_path', { length: 512 }).notNull().default(''),
  ogImageUrl: text('og_image_url').notNull().default(''),
  twitterImageUrl: text('twitter_image_url').notNull().default(''),
  robotsIndex: boolean('robots_index').notNull().default(true),
  authorName: varchar('author_name', { length: 255 }).notNull().default('Nebuloid Tech Studio'),
  schemaType: varchar('schema_type', { length: 64 }).notNull().default('BlogPosting'),
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
  focusKeyword: varchar('focus_keyword', { length: 128 }).notNull().default(''),
  canonicalPath: varchar('canonical_path', { length: 512 }).notNull().default(''),
  ogImageUrl: text('og_image_url').notNull().default(''),
  twitterImageUrl: text('twitter_image_url').notNull().default(''),
  robotsIndex: boolean('robots_index').notNull().default(true),
  schemaType: varchar('schema_type', { length: 64 }).notNull().default('Service'),
  previewToken: varchar('preview_token', { length: 64 }).notNull().default(''),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type DetailSectionRow = {
  title: string
  content: string
}

export type FaqItemRow = {
  question: string
  answer: string
}

export type RelatedPathRow = {
  label: string
  href: string
}

export const locationLandingsCms = pgTable('location_landings', {
  id: text('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 512 }).notNull(),
  city: varchar('city', { length: 128 }).notNull().default(''),
  serviceLabel: varchar('service_label', { length: 255 }).notNull().default(''),
  heroIntro: text('hero_intro').notNull().default(''),
  whatIsIt: text('what_is_it').notNull().default(''),
  benefits: jsonb('benefits').$type<string[]>().notNull().default([]),
  features: jsonb('features').$type<string[]>().notNull().default([]),
  howItWorks: jsonb('how_it_works').$type<string[]>().notNull().default([]),
  industries: jsonb('industries').$type<string[]>().notNull().default([]),
  useCases: jsonb('use_cases').$type<string[]>().notNull().default([]),
  whyChooseUs: jsonb('why_choose_us').$type<string[]>().notNull().default([]),
  faqs: jsonb('faqs').$type<FaqItemRow[]>().notNull().default([]),
  conclusion: text('conclusion').notNull().default(''),
  relatedPaths: jsonb('related_paths').$type<RelatedPathRow[]>().notNull().default([]),
  status: varchar('status', { length: 32 }).notNull().default('draft'),
  metaTitle: varchar('meta_title', { length: 255 }).notNull().default(''),
  metaDescription: text('meta_description').notNull().default(''),
  focusKeyword: varchar('focus_keyword', { length: 128 }).notNull().default(''),
  canonicalPath: varchar('canonical_path', { length: 512 }).notNull().default(''),
  ogImageUrl: text('og_image_url').notNull().default(''),
  twitterImageUrl: text('twitter_image_url').notNull().default(''),
  robotsIndex: boolean('robots_index').notNull().default(true),
  schemaType: varchar('schema_type', { length: 64 }).notNull().default('Service'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const experienceServicesCms = pgTable('experience_services', {
  id: text('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 512 }).notNull(),
  description: text('description').notNull().default(''),
  detail: text('detail').notNull().default(''),
  tags: jsonb('tags').$type<string[]>().notNull().default([]),
  imageUrl: text('image_url').notNull().default(''),
  imageAlt: text('image_alt').notNull().default(''),
  intro: text('intro').notNull().default(''),
  sections: jsonb('sections').$type<DetailSectionRow[]>().notNull().default([]),
  highlights: jsonb('highlights').$type<string[]>().notNull().default([]),
  displayLabel: varchar('display_label', { length: 8 }).notNull().default(''),
  displayOrder: integer('display_order').notNull().default(0),
  enabled: boolean('enabled').notNull().default(true),
  status: varchar('status', { length: 32 }).notNull().default('draft'),
  metaTitle: varchar('meta_title', { length: 255 }).notNull().default(''),
  metaDescription: text('meta_description').notNull().default(''),
  focusKeyword: varchar('focus_keyword', { length: 128 }).notNull().default(''),
  canonicalPath: varchar('canonical_path', { length: 512 }).notNull().default(''),
  ogImageUrl: text('og_image_url').notNull().default(''),
  twitterImageUrl: text('twitter_image_url').notNull().default(''),
  robotsIndex: boolean('robots_index').notNull().default(true),
  schemaType: varchar('schema_type', { length: 64 }).notNull().default('Service'),
  previewToken: varchar('preview_token', { length: 64 }).notNull().default(''),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const siteSettings = pgTable('site_settings', {
  id: text('id').primaryKey(),
  whatsappEnabled: boolean('whatsapp_enabled').notNull().default(false),
  /** Full click-to-chat URL, e.g. https://wa.me/message/L72JRPHENDZIJ1 — preferred when set. */
  whatsappLink: text('whatsapp_link').notNull().default(''),
  whatsappPhone: varchar('whatsapp_phone', { length: 32 }).notNull().default(''),
  whatsappMessage: text('whatsapp_message')
    .notNull()
    .default('Hello! I would like to know more about Nebuloid Tech Studio.'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type AdminUser = typeof adminUsers.$inferSelect
export type MediaAsset = typeof mediaAssets.$inferSelect
export type BlogPostCms = typeof blogPostsCms.$inferSelect
export type DigitalExperienceCard = typeof digitalExperienceCards.$inferSelect
export type LocationLandingCms = typeof locationLandingsCms.$inferSelect
export type ExperienceServiceCms = typeof experienceServicesCms.$inferSelect
export type SiteSettings = typeof siteSettings.$inferSelect
