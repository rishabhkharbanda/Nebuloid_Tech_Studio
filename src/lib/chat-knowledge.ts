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

function scoreChunk(chunk: KnowledgeChunk, terms: string[]) {
  const haystack = `${chunk.title} ${chunk.category} ${chunk.content}`.toLowerCase()
  let score = 0
  for (const term of terms) {
    if (!term) continue
    if (chunk.title.toLowerCase().includes(term)) score += 6
    if (chunk.category.toLowerCase().includes(term)) score += 3
    if (haystack.includes(term)) score += 2
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
  )

  return chunks
}

export function retrieveChatKnowledge(
  chunks: KnowledgeChunk[],
  query: string,
  limit = 8,
): KnowledgeChunk[] {
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .map((term) => term.trim())
    .filter((term) => term.length > 2)

  if (!terms.length) {
    return chunks.filter((chunk) => ['company', 'contact', 'page-experiences'].includes(chunk.id))
  }

  return [...chunks]
    .map((chunk) => ({ chunk, score: scoreChunk(chunk, terms) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.chunk)
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
