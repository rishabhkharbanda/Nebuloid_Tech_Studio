export type SeoIssue = {
  id: string
  severity: 'error' | 'warning' | 'pass'
  message: string
  tip: string
}

export type SeoAnalysis = {
  score: number
  issues: SeoIssue[]
}

type AnalyzeInput = {
  title: string
  slug: string
  excerpt: string
  body: string
  metaTitle: string
  metaDescription: string
  focusKeyword: string
  featuredImageUrl: string
  featuredImageAlt: string
  canonicalPath?: string
  ogImageUrl?: string
  robotsIndex?: boolean
}

function countWords(value: string) {
  return value
    .replace(/<[^>]+>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

function avgSentenceLength(text: string) {
  const sentences = text
    .replace(/<[^>]+>/g, ' ')
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean)
  if (!sentences.length) return 0
  const words = sentences.reduce((sum, sentence) => sum + countWords(sentence), 0)
  return words / sentences.length
}

export function analyzeBlogSeo(input: AnalyzeInput): SeoAnalysis {
  const issues: SeoIssue[] = []
  const metaTitle = input.metaTitle || input.title
  const metaDescription = input.metaDescription || input.excerpt
  const keyword = input.focusKeyword.trim().toLowerCase()
  const bodyText = input.body.replace(/<[^>]+>/g, ' ')
  const titleLower = input.title.toLowerCase()
  const slugLower = input.slug.toLowerCase()
  const descLower = metaDescription.toLowerCase()

  const push = (
    id: string,
    severity: SeoIssue['severity'],
    message: string,
    tip: string,
  ) => issues.push({ id, severity, message, tip })

  if (!metaTitle.trim()) {
    push('meta-title-missing', 'error', 'Meta title is missing', 'Add a meta title under 60 characters.')
  } else if (metaTitle.length < 30) {
    push('meta-title-short', 'warning', 'Meta title is short', 'Aim for 30–60 characters.')
  } else if (metaTitle.length > 60) {
    push('meta-title-long', 'warning', 'Meta title may truncate in SERPs', 'Keep meta title under 60 characters.')
  } else {
    push('meta-title-ok', 'pass', 'Meta title length looks good', 'Keep titles descriptive and unique.')
  }

  if (!metaDescription.trim()) {
    push(
      'meta-desc-missing',
      'error',
      'Meta description is missing',
      'Write a 120–160 character meta description.',
    )
  } else if (metaDescription.length < 120) {
    push('meta-desc-short', 'warning', 'Meta description is short', 'Aim for 120–160 characters.')
  } else if (metaDescription.length > 160) {
    push('meta-desc-long', 'warning', 'Meta description may truncate', 'Keep under 160 characters.')
  } else {
    push('meta-desc-ok', 'pass', 'Meta description length looks good', 'Include the focus keyword naturally.')
  }

  if (!input.slug.trim()) {
    push('slug-missing', 'error', 'URL slug is missing', 'Add a short kebab-case slug.')
  } else if (input.slug.length > 75) {
    push('slug-long', 'warning', 'Slug is quite long', 'Shorter URLs usually perform better.')
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)) {
    push('slug-format', 'warning', 'Slug formatting can improve', 'Use lowercase letters, numbers, and hyphens only.')
  } else {
    push('slug-ok', 'pass', 'Slug looks SEO-friendly', 'Keep it stable after publishing.')
  }

  const canonical = input.canonicalPath?.trim()
  if (!canonical) {
    push('canonical-missing', 'warning', 'Canonical path not set', 'Defaults to /insights/{slug}. Set explicitly for overrides.')
  } else if (!canonical.startsWith('/')) {
    push('canonical-format', 'error', 'Canonical should be a site path', 'Use a path like /insights/my-post.')
  } else {
    push('canonical-ok', 'pass', 'Canonical path is set', 'Avoid duplicate indexation with conflicting URLs.')
  }

  if (!input.featuredImageUrl) {
    push('image-missing', 'error', 'Featured image is missing', 'Upload a featured image for social and article headers.')
  } else if (!input.featuredImageAlt.trim()) {
    push('image-alt-missing', 'error', 'Featured image alt text is missing', 'Describe the image for accessibility and SEO.')
  } else {
    push('image-alt-ok', 'pass', 'Featured image has alt text', 'Keep alt text concise and descriptive.')
  }

  if (!input.ogImageUrl && !input.featuredImageUrl) {
    push('og-missing', 'warning', 'Open Graph image missing', 'Set an OG image for social sharing previews.')
  } else {
    push('og-ok', 'pass', 'Social share image available', 'Prefer 1200×630 imagery.')
  }

  const h2Count = (input.body.match(/<h2[\s>]/gi) || []).length
  const h3Count = (input.body.match(/<h3[\s>]/gi) || []).length
  const h1InBody = (input.body.match(/<h1[\s>]/gi) || []).length
  if (h1InBody > 0) {
    push('heading-h1', 'warning', 'Body contains H1 tags', 'Use one page H1 (title) and H2/H3 in the body.')
  } else if (h2Count === 0 && countWords(bodyText) > 300) {
    push('heading-h2', 'warning', 'No H2 headings found', 'Break long content with clear H2 sections.')
  } else if (h3Count > 0 && h2Count === 0) {
    push('heading-order', 'warning', 'H3 used without H2', 'Keep heading hierarchy sequential.')
  } else {
    push('heading-ok', 'pass', 'Heading structure looks reasonable', 'Use H2/H3 for scannable sections.')
  }

  const internalLinks = (input.body.match(/href=["']\/[^"']+["']/gi) || []).length
  const externalLinks = (input.body.match(/href=["']https?:\/\/[^"']+["']/gi) || []).length
  if (internalLinks === 0 && countWords(bodyText) > 400) {
    push('internal-links', 'warning', 'No internal links in body', 'Link to solutions, digital experiences, or contact.')
  } else {
    push('internal-links-ok', 'pass', `Internal links found (${internalLinks})`, 'Keep links contextual and useful.')
  }
  if (externalLinks > 12) {
    push('external-links', 'warning', 'Many external links', 'Prefer fewer, high-quality outbound references.')
  }

  const imgTags = input.body.match(/<img\b[^>]*>/gi) || []
  const missingAlt = imgTags.filter((tag) => !/\balt=["'][^"']+["']/i.test(tag)).length
  if (missingAlt > 0) {
    push('body-img-alt', 'error', `${missingAlt} body image(s) missing alt`, 'Add descriptive alt text to every image.')
  } else if (imgTags.length > 0) {
    push('body-img-alt-ok', 'pass', 'Body images include alt text', 'Good for accessibility and image SEO.')
  }

  if (keyword) {
    if (!titleLower.includes(keyword)) {
      push('kw-title', 'warning', 'Focus keyword missing from title', 'Include the focus keyword near the start of the title.')
    } else {
      push('kw-title-ok', 'pass', 'Focus keyword appears in title', 'Avoid keyword stuffing.')
    }
    if (!descLower.includes(keyword)) {
      push('kw-desc', 'warning', 'Focus keyword missing from meta description', 'Mention the keyword once, naturally.')
    } else {
      push('kw-desc-ok', 'pass', 'Focus keyword appears in meta description', 'Good topical alignment.')
    }
    if (!slugLower.includes(keyword.replace(/\s+/g, '-'))) {
      push('kw-slug', 'warning', 'Focus keyword missing from slug', 'Include the keyword in the URL slug when natural.')
    } else {
      push('kw-slug-ok', 'pass', 'Focus keyword appears in slug', 'Good for topical relevance.')
    }
    if (!bodyText.toLowerCase().includes(keyword)) {
      push('kw-body', 'warning', 'Focus keyword missing from body', 'Use the keyword naturally in the first paragraphs.')
    } else {
      push('kw-body-ok', 'pass', 'Focus keyword appears in body', 'Maintain readable phrasing.')
    }
  } else {
    push('kw-missing', 'warning', 'No focus keyword set', 'Set a primary keyword to guide on-page optimization.')
  }

  const words = countWords(bodyText)
  if (words < 300) {
    push('content-short', 'warning', 'Content is under 300 words', 'Aim for fuller coverage when the topic warrants it.')
  } else if (words < 800) {
    push('content-medium', 'pass', `Content length is usable (${words} words)`, 'Longer guides can win competitive queries.')
  } else {
    push('content-length-ok', 'pass', `Content length looks solid (${words} words)`, 'Keep paragraphs focused and scannable.')
  }

  const sentenceAvg = avgSentenceLength(bodyText)
  if (sentenceAvg > 28) {
    push('readability', 'warning', 'Sentences may be too long', 'Aim for clearer, shorter sentences for readability.')
  } else if (words > 100) {
    push('readability-ok', 'pass', 'Readability looks reasonable', 'Use short paragraphs and descriptive subheads.')
  }

  if (input.robotsIndex === false) {
    push('robots-noindex', 'warning', 'Page is set to noindex', 'Only use noindex for private/unfinished content.')
  } else {
    push('robots-index-ok', 'pass', 'Page is indexable', 'Ensure canonical and sitemap inclusion stay aligned.')
  }

  push('schema-ready', 'pass', 'BlogPosting schema is generated on publish', 'Fill author, dates, and images for richer results.')
  push('cwv-tip', 'pass', 'Prefer compressed images and stable layouts', 'Keep LCP media optimized and avoid layout shifts.')

  const errorCount = issues.filter((i) => i.severity === 'error').length
  const warningCount = issues.filter((i) => i.severity === 'warning').length
  const passCount = issues.filter((i) => i.severity === 'pass').length
  const raw = 100 - errorCount * 16 - warningCount * 6 + Math.min(passCount, 12)
  const score = Math.max(0, Math.min(100, raw))

  return { score, issues }
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function estimateReadTime(body: string) {
  const words = countWords(body)
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}

export function bodyToParagraphs(body: string): string[] {
  const cleaned = body
    .replace(/<\/p>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\r/g, '')
  return cleaned
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
}
