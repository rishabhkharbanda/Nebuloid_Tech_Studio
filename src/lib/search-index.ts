export type SearchResult = {
  title: string
  href: string
  category: string
  excerpt?: string
}

/** Static pages always available for search (dynamic CMS items added via API). */
export const staticSearchIndex: SearchResult[] = [
  { title: 'Home', href: '/', category: 'Page' },
  { title: 'Experiences We Offer', href: '/experiences', category: 'Page' },
  { title: 'Our Work', href: '/digital-experiences', category: 'Page' },
  { title: 'Blogs', href: '/insights', category: 'Page' },
  { title: 'About', href: '/about', category: 'Page' },
  { title: 'Contact', href: '/contact', category: 'Page' },
  { title: 'Capabilities', href: '/capabilities', category: 'Page' },
  { title: 'Technology', href: '/technology', category: 'Page' },
  { title: 'Industries', href: '/industries', category: 'Page' },
  { title: 'Process', href: '/process', category: 'Page' },
  { title: 'FAQ', href: '/faq', category: 'Page' },
]

export function filterSearchResults(items: SearchResult[], query: string, limit = 8) {
  const needle = query.trim().toLowerCase()
  if (!needle) return []
  return items
    .filter((item) =>
      [item.title, item.category, item.excerpt ?? ''].some((value) =>
        value.toLowerCase().includes(needle),
      ),
    )
    .slice(0, limit)
}

export function mergeSearchResults(...groups: SearchResult[][]) {
  const seen = new Set<string>()
  const merged: SearchResult[] = []
  for (const group of groups) {
    for (const item of group) {
      if (seen.has(item.href)) continue
      seen.add(item.href)
      merged.push(item)
    }
  }
  return merged
}
