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

/** Inject stable ids into h2/h3 and return a TOC list for in-article navigation. */
export function enrichBlogHtml(html: string): { html: string; headings: BlogHeading[] } {
  if (!html.trim()) return { html: '', headings: [] }

  const used = new Set<string>()
  const headings: BlogHeading[] = []

  const nextHtml = html.replace(
    /<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi,
    (_match, tag: string, attrs: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, '').trim()
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
