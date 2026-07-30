import { getSiteSettings } from '@/lib/cms/site-settings'

/** Built-in fallback when CMS default is empty. */
export const DEFAULT_BLOG_IMAGE = '/assets/site-content/blog-default.jpg'

/** Imported HTML used dead CDN placeholders — treat as "no image". */
const UNUSABLE_IMAGE_RE =
  /cdnasset\.com\/articles\/placeholder\/|\/placeholder\/[^/]+\.(?:png|jpe?g|webp|gif)(?:\?|$)/i

export function isUsableBlogImageUrl(imageUrl?: string | null) {
  const trimmed = imageUrl?.trim()
  if (!trimmed) return false
  const lower = trimmed.toLowerCase()
  if (lower === '#' || lower === 'about:blank' || lower.startsWith('data:,')) return false
  if (UNUSABLE_IMAGE_RE.test(trimmed)) return false
  return true
}

export function resolveBlogImage(imageUrl?: string | null, fallback?: string | null) {
  if (isUsableBlogImageUrl(imageUrl)) return imageUrl!.trim()
  const customFallback = fallback?.trim()
  if (customFallback && isUsableBlogImageUrl(customFallback)) return customFallback
  if (customFallback) return customFallback
  return DEFAULT_BLOG_IMAGE
}

/**
 * Display alt only — does not write to the CMS.
 * Preserves an empty CMS alt when a custom image is set; uses title for the default cover.
 */
export function resolveBlogImageAlt(
  imageUrl: string | null | undefined,
  imageAlt: string | null | undefined,
  title: string,
) {
  const cmsAlt = imageAlt?.trim()
  if (cmsAlt) return cmsAlt
  const hasCustomImage = isUsableBlogImageUrl(imageUrl)
  return hasCustomImage ? title : `${title} — Nebuloid Tech Studio`
}

/** CMS-configured default cover, or the built-in asset. */
export async function getDefaultBlogImageUrl() {
  const settings = await getSiteSettings()
  return resolveBlogImage(null, settings.defaultBlogImageUrl)
}
