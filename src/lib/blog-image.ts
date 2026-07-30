/** Fallback cover when a blog has no featured image URL set in CMS. */
export const DEFAULT_BLOG_IMAGE = '/assets/site-content/blog-default.jpg'

export function resolveBlogImage(imageUrl?: string | null) {
  const trimmed = imageUrl?.trim()
  return trimmed || DEFAULT_BLOG_IMAGE
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
