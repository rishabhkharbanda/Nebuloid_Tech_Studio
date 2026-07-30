export type BlogHeading = {
  id: string
  text: string
}

function slugifyHeading(text: string, used: Set<string>) {
  const base =
    text
      .toLowerCase()
      .replace(/<[^>]+>/g, '')
      .replace(/&[^;]+;/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 64) || 'section'

  let id = base
  let i = 2
  while (used.has(id)) {
    id = `${base}-${i}`
    i += 1
  }
  used.add(id)
  return id
}

function stripTags(html: string) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function imgSrc(tag: string) {
  return tag.match(/\ssrc=["']([^"']*)["']/i)?.[1]?.trim() ?? ''
}

function hasUsableSrc(src: string) {
  if (!src) return false
  const lower = src.toLowerCase()
  if (lower === '#' || lower === 'about:blank' || lower.startsWith('data:,')) return false
  return true
}

/**
 * Remove WordPress/Notion-style attachment chrome and broken empty images
 * that browsers render as a broken-icon + alt-text pill.
 */
export function stripAttachedSections(html: string) {
  if (!html.trim()) return ''

  let next = html

  // File / attachment blocks
  next = next.replace(
    /<figure[^>]*class=["'][^"']*(?:wp-block-file|wp-block-audio|attachment)[^"']*["'][^>]*>[\s\S]*?<\/figure>/gi,
    '',
  )
  next = next.replace(
    /<(?:div|aside|section)[^>]*class=["'][^"']*attachment[^"']*["'][^>]*>[\s\S]*?<\/(?:div|aside|section)>/gi,
    '',
  )

  // Explicit "Attached" / "Attachments" sections through the next heading or end
  next = next.replace(
    /<(h[1-6])([^>]*)>\s*(?:Attached|Attachments?|Attachment)\s*<\/\1>[\s\S]*?(?=<(?:h[1-6]|\/(?:article|main|body|section))\b|$)/gi,
    '',
  )

  // Empty / unusable images (broken-icon + alt text in the browser)
  next = next.replace(/<p>\s*(<img\b[^>]*>)\s*<\/p>/gi, (_match, img: string) => {
    return hasUsableSrc(imgSrc(img)) ? _match : ''
  })
  next = next.replace(/<img\b[^>]*>/gi, (tag) => (hasUsableSrc(imgSrc(tag)) ? tag : ''))

  // Empty figures left behind after image removal
  next = next.replace(/<figure[^>]*>\s*(?:<figcaption[^>]*>[\s\S]*?<\/figcaption>)?\s*<\/figure>/gi, '')

  // Collapse leftover empty paragraphs
  next = next.replace(/(?:<p>\s*<\/p>\s*)+/gi, '')

  return next.trim()
}

/** Inject stable ids into h2/h3 and return a TOC list for in-article navigation. */
export function enrichBlogHtml(html: string): { html: string; headings: BlogHeading[] } {
  const cleaned = stripAttachedSections(html)
  if (!cleaned) return { html: '', headings: [] }

  const used = new Set<string>()
  const headings: BlogHeading[] = []

  const nextHtml = cleaned.replace(
    /<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi,
    (_match, tag: string, attrs: string, inner: string) => {
      const text = stripTags(inner)
      if (!text) return `<${tag}${attrs}>${inner}</${tag}>`

      const existing = attrs.match(/\sid=["']([^"']+)["']/i)
      const id = existing?.[1] || slugifyHeading(text, used)
      if (!existing) used.add(id)

      headings.push({ id, text })

      if (existing) return `<${tag}${attrs}>${inner}</${tag}>`
      return `<${tag}${attrs} id="${id}">${inner}</${tag}>`
    },
  )

  return { html: nextHtml, headings }
}
