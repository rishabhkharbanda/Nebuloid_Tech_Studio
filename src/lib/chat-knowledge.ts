import {
  getBlogPostsForListing,
  getDigitalExperienceCards,
} from '@/lib/content'
import { digitalProjects } from '@/lib/digital-data'
import { contactDetails, faqs, projects, services } from '@/lib/site-data'

export type KnowledgeChunk = {
  id: string
  title: string
  url: string
  category: string
  content: string
}

/** Expand short / topical queries so “AI” also matches related site pages. */
const TOPIC_EXPANSIONS: Record<string, string[]> = {
  ai: [
    'ai',
    'artificial intelligence',
    'selfie',
    'photo booth',
    'photobooth',
    'vision',
    'personalisation',
    'personalization',
    'smart engagement',
    'generative',
  ],
  booth: ['booth', 'selfie', 'photo booth', 'ai booth', 'photobooth'],
  kiosk: ['kiosk', 'touchscreen', 'interactive', 'self-serve', 'registration'],
  led: ['led', 'stage', 'display', 'screen', 'media wall'],
  vr: ['vr', 'virtual reality', 'immersive', 'headset'],
  event: ['event', 'activation', 'conference', 'exhibition', 'brand'],
  digital: ['digital', 'website', 'platform', 'app', 'interactive'],
  analytics: ['analytics', 'dashboard', 'lead capture', 'reporting', 'intelligence'],
  branding: ['branding', 'creative', 'motion', 'graphics', 'identity'],
  registration: ['registration', 'check-in', 'badge', 'guest journey', 'qr'],
  government: ['government', 'public', 'civic', 'platform'],
  gaming: ['gaming', 'game', 'interactive', 'playable', 'quiz'],
}

function expandQueryTerms(query: string): string[] {
  const raw = query
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .map((term) => term.trim())
    .filter((term) => term.length >= 2)

  const expanded = new Set<string>()
  for (const term of raw) {
    expanded.add(term)
    const synonyms = TOPIC_EXPANSIONS[term]
    if (synonyms) {
      for (const synonym of synonyms) expanded.add(synonym)
    }
  }

  // Also keep multi-word expansions as phrase matches in scoring.
  return [...expanded]
}

function scoreChunk(chunk: KnowledgeChunk, terms: string[]) {
  const title = chunk.title.toLowerCase()
  const category = chunk.category.toLowerCase()
  const haystack = `${title} ${category} ${chunk.content}`.toLowerCase()
  let score = 0

  for (const term of terms) {
    if (!term) continue
    if (title.includes(term)) score += term.length <= 2 ? 8 : 6
    if (category.includes(term)) score += 3
    if (haystack.includes(term)) score += term.length <= 2 ? 4 : 2

    // Soft relatedness: match tokens from multi-word expansions.
    if (term.includes(' ')) {
      const parts = term.split(/\s+/).filter((part) => part.length >= 2)
      const partHits = parts.filter((part) => haystack.includes(part)).length
      if (partHits >= Math.min(2, parts.length)) score += 2
    }
  }

  return score
}

export async function buildChatKnowledge(): Promise<KnowledgeChunk[]> {
  const [blogs, digitalCards] = await Promise.all([
    getBlogPostsForListing(),
    getDigitalExperienceCards(),
  ])

  const chunks: KnowledgeChunk[] = [
    {
      id: 'company',
      title: 'About Nebuloid Tech Studio',
      url: '/about',
      category: 'Company',
      content:
        'Nebuloid Tech Studio designs and builds creative technology ecosystems for live events — branding, motion, kiosks, AI experiences, registration, venue navigation, and analytics — as one partner rather than multiple vendors. Based in Gurugram, Haryana, India.',
    },
    {
      id: 'contact',
      title: 'Contact Nebuloid',
      url: '/contact',
      category: 'Contact',
      content: [
        `Address: ${contactDetails.address.lines.join(', ')}`,
        `Phone: ${contactDetails.phone}`,
        `Email: ${contactDetails.email}`,
        'For project inquiries, use the Contact page or WhatsApp floating button on the site.',
      ].join('\n'),
    },
    ...services.map((service) => ({
      id: `service-${service.slug}`,
      title: service.title,
      url: `/experiences/${service.slug}`,
      category: 'Experience',
      content: `${service.description}\n${service.detail}\nTags: ${service.tags.join(', ')}`,
    })),
    ...projects.map((project) => ({
      id: `project-${project.slug}`,
      title: project.title,
      url: `/experiences/${project.slug}`,
      category: 'Case Study',
      content: `Category: ${project.category}. Tech: ${project.tech}`,
    })),
    ...faqs.map((faq, index) => ({
      id: `faq-${index}`,
      title: faq.question,
      url: '/faq',
      category: 'FAQ',
      content: faq.answer,
    })),
  ]

  if (digitalCards.length) {
    for (const card of digitalCards) {
      chunks.push({
        id: `digital-${card.slug}`,
        title: card.title,
        url: `/digital-experiences/${card.slug}`,
        category: 'Our Work',
        content: card.overview,
      })
    }
  } else {
    for (const project of digitalProjects) {
      chunks.push({
        id: `digital-${project.slug}`,
        title: project.title,
        url: `/digital-experiences/${project.slug}`,
        category: 'Our Work',
        content: [
          `Client: ${project.client}`,
          `Category: ${project.category}`,
          project.overview,
          `Contribution: ${project.contribution.join(', ')}`,
          `Impact: ${project.impact.join('; ')}`,
        ].join('\n'),
      })
    }
  }

  for (const post of blogs) {
    chunks.push({
      id: `blog-${post.slug}`,
      title: post.title,
      url: `/insights/${post.slug}`,
      category: 'Blog',
      content: post.excerpt,
    })
  }

  chunks.push(
    {
      id: 'page-experiences',
      title: 'Experiences We Offer',
      url: '/experiences',
      category: 'Page',
      content:
        'Overview of Nebuloid experience services and case studies — event branding, registration, interactive installations, AI experiences, event websites, and analytics.',
    },
    {
      id: 'page-digital',
      title: 'Our Work',
      url: '/digital-experiences',
      category: 'Page',
      content: 'Portfolio of digital experience projects delivered for events and brands.',
    },
    {
      id: 'page-insights',
      title: 'Blogs / Insights',
      url: '/insights',
      category: 'Page',
      content: 'Articles and insights from Nebuloid about event technology and creative production.',
    },
    {
      id: 'page-technology',
      title: 'Technology',
      url: '/technology',
      category: 'Page',
      content:
        'Nebuloid technology stack for AI photo booths, interactive kiosks, LED experiences, and event systems.',
    },
  )

  return chunks
}

export function retrieveChatKnowledge(
  chunks: KnowledgeChunk[],
  query: string,
  limit = 12,
): { matches: KnowledgeChunk[]; hasStrongMatch: boolean } {
  const terms = expandQueryTerms(query)

  if (!terms.length) {
    return {
      matches: chunks.filter((chunk) =>
        ['company', 'contact', 'page-experiences'].includes(chunk.id),
      ),
      hasStrongMatch: false,
    }
  }

  const scored = [...chunks]
    .map((chunk) => ({ chunk, score: scoreChunk(chunk, terms) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)

  // Any positive score counts as a usable related match for link suggestions.
  const hasStrongMatch = scored.some((entry) => entry.score >= 2)
  const selected = scored.slice(0, limit).map((entry) => entry.chunk)

  return { matches: selected, hasStrongMatch }
}

export function pickChatLinks(chunks: KnowledgeChunk[], limit = 8) {
  const seen = new Set<string>()
  const links: Array<{ title: string; url: string; category: string }> = []

  for (const chunk of chunks) {
    if (!chunk.url || chunk.url === '/contact') continue
    if (seen.has(chunk.url)) continue
    seen.add(chunk.url)
    links.push({
      title: chunk.title,
      url: chunk.url,
      category: chunk.category,
    })
    if (links.length >= limit) break
  }

  return links
}

export function formatKnowledgeForPrompt(chunks: KnowledgeChunk[]) {
  if (!chunks.length) {
    return 'No matching site pages found for this question.'
  }

  return chunks
    .map(
      (chunk, index) =>
        `[${index + 1}] ${chunk.title} (${chunk.category})\nURL: ${chunk.url}\n${chunk.content}`,
    )
    .join('\n\n')
}
