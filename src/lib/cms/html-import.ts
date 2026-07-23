import { slugify } from '@/lib/cms/seo-analyzer'

export type ImportedBlogHtml = {
  title: string
  slug: string
  excerpt: string
  metaTitle: string
  metaDescription: string
  bodyHtml: string
  featuredImageUrl: string
  featuredImageAlt: string
}

function decodeEntities(value: string) {
  return value
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
}

function metaContent(html: string, name: string) {
  const patterns = [
    new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+name=["']${name}["']`, 'i'),
  ]
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]) return decodeEntities(match[1].trim())
  }
  return ''
}

function firstMatch(html: string, pattern: RegExp) {
  const match = html.match(pattern)
  return match?.[1]?.trim() ? decodeEntities(match[1].trim()) : ''
}

function stripTags(html: string) {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
}

function sanitizeBody(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/\son\w+=["'][^"']*["']/gi, '')
    .replace(/\son\w+=\{[^}]*\}/gi, '')
    .trim()
}

function extractArticleHtml(html: string) {
  const article = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)?.[1]
  if (article) return article.trim()
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1]
  if (main) return main.trim()
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1]
  return (body || html).trim()
}

function extractFirstImage(html: string) {
  const match = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i)
  if (!match) return { url: '', alt: '' }
  const tag = match[0]
  const url = match[1].trim()
  const alt = tag.match(/alt=["']([^"']*)["']/i)?.[1]?.trim() || ''
  return { url, alt: decodeEntities(alt) }
}

function stripLeadingChrome(body: string, title: string) {
  let next = body.trim()
  const escapedTitle = title
    ? title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    : ''

  for (let i = 0; i < 4; i += 1) {
    const before = next
    if (escapedTitle) {
      next = next.replace(new RegExp(`^<h1[^>]*>\\s*${escapedTitle}\\s*</h1>\\s*`, 'i'), '')
    } else {
      next = next.replace(/^<h1[^>]*>[\s\S]*?<\/h1>\s*/i, '')
    }
    next = next.replace(/^(?:<p>\s*)?<img\b[^>]*>\s*(?:<\/p>)?\s*/i, '')
    next = next.replace(/^(?:<hr\s*\/?>\s*)+/i, '')
    next = next.trim()
    if (next === before) break
  }

  return next
}

function excerptFromBody(body: string) {
  const firstParagraph = firstMatch(body, /<p[^>]*>([\s\S]*?)<\/p>/i)
  const text = stripTags(firstParagraph || body)
  if (text.length <= 220) return text
  return `${text.slice(0, 217).trim()}…`
}

export function parseBlogHtmlFile(html: string, fileName = ''): ImportedBlogHtml {
  const titleFromTag = firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i)
  let body = sanitizeBody(extractArticleHtml(html))
  const titleFromH1 = firstMatch(body, /<h1[^>]*>([\s\S]*?)<\/h1>/i)
  const title = stripTags(titleFromTag || titleFromH1) || 'Untitled post'
  const metaDescription = metaContent(html, 'description')
  const image = extractFirstImage(body)
  body = stripLeadingChrome(body, title)

  const baseName = fileName.replace(/\.html?$/i, '').trim()
  const slug = slugify(baseName || title)

  return {
    title,
    slug,
    excerpt: metaDescription || excerptFromBody(body),
    metaTitle: title,
    metaDescription: metaDescription || excerptFromBody(body),
    bodyHtml: body,
    featuredImageUrl: image.url,
    featuredImageAlt: image.alt || title,
  }
}
