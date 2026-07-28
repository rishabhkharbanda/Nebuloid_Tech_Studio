import { NextResponse } from 'next/server'
import {
  getAllBlogSlugs,
  getBlogPostsForListing,
  getDigitalExperienceCards,
} from '@/lib/content'
import {
  filterSearchResults,
  mergeSearchResults,
  staticSearchIndex,
  type SearchResult,
} from '@/lib/search-index'
import { digitalProjects } from '@/lib/digital-data'
import { projects, services } from '@/lib/site-data'

export const revalidate = 60

function serviceResults(): SearchResult[] {
  return services.map((service) => ({
    title: service.title,
    href: `/experiences/${service.slug}`,
    category: 'Experience',
    excerpt: service.description,
  }))
}

function projectResults(): SearchResult[] {
  return projects.map((project) => ({
    title: project.title,
    href: `/experiences/${project.slug}`,
    category: 'Case Study',
    excerpt: project.tech,
  }))
}

function digitalResults(cards: Awaited<ReturnType<typeof getDigitalExperienceCards>>): SearchResult[] {
  if (cards.length) {
    return cards.map((card) => ({
      title: card.title,
      href: `/digital-experiences/${card.slug}`,
      category: 'Our Work',
      excerpt: card.overview,
    }))
  }
  return digitalProjects.map((project) => ({
    title: project.title,
    href: `/digital-experiences/${project.slug}`,
    category: 'Our Work',
    excerpt: project.overview,
  }))
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') ?? ''
  const limit = Math.min(Number(searchParams.get('limit') ?? 8), 20)

  const [blogs, digitalCards] = await Promise.all([
    getBlogPostsForListing(),
    getDigitalExperienceCards(),
  ])

  const blogResults: SearchResult[] = blogs.map((post) => ({
    title: post.title,
    href: `/insights/${post.slug}`,
    category: 'Blog',
    excerpt: post.excerpt,
  }))

  const index = mergeSearchResults(
    staticSearchIndex,
    serviceResults(),
    projectResults(),
    digitalResults(digitalCards),
    blogResults,
  )

  // Warm blog slugs cache for generateStaticParams parity (no-op side effect ok)
  void getAllBlogSlugs()

  return NextResponse.json({
    results: filterSearchResults(index, q, limit),
  })
}
