import { getSiteSettings } from '@/lib/cms/site-settings'

/** Built-in fallback when CMS default is empty. */
export const DEFAULT_BLOG_IMAGE = '/assets/site-content/blog-default.jpg'

export function resolveBlogImage(imageUrl?: string | null, fallback?: string | null) {
  const trimmed = imageUrl?.trim()
  if (trimmed) return trimmed
  const customFallback = fallback?.trim()
  return customFallback || DEFAULT_BLOG_IMAGE
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
  const hasCustomImage = Boolean(imageUrl?.trim())
  return hasCustomImage ? title : `${title} — Nebuloid Tech Studio`
}

/** CMS-configured default cover, or the built-in asset. */
export async function getDefaultBlogImageUrl() {
  const settings = await getSiteSettings()
  return resolveBlogImage(null, settings.defaultBlogImageUrl)
}
