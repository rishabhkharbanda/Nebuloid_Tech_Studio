import { NextResponse } from 'next/server'
import {
  getBlogPostsForListingCached,
  getDigitalExperienceCardsCached,
  getExperienceServicesCached,
} from '@/lib/cms/cached-content'
import {
  filterSearchResults,
  mergeSearchResults,
  staticSearchIndex,
  type SearchResult,
} from '@/lib/search-index'
import { digitalProjects } from '@/lib/digital-data'
import { projects } from '@/lib/site-data'

function projectResults(): SearchResult[] {
  return projects.map((project) => ({
    title: project.title,
    href: `/experiences/${project.slug}`,
    category: 'Case Study',
    excerpt: project.tech,
  }))
}

function digitalResults(cards: Awaited<ReturnType<typeof getDigitalExperienceCardsCached>>): SearchResult[] {
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

  const [blogs, digitalCards, experienceServices] = await Promise.all([
    getBlogPostsForListingCached(),
    getDigitalExperienceCardsCached(),
    getExperienceServicesCached(),
  ])

  const serviceResults: SearchResult[] = experienceServices.map((service) => ({
    title: service.title,
    href: `/experiences/${service.slug}`,
    category: 'Experience',
    excerpt: service.description,
  }))

  const blogResults: SearchResult[] = blogs.map((post) => ({
    title: post.title,
    href: `/insights/${post.slug}`,
    category: 'Blog',
    excerpt: post.excerpt,
  }))

  const index = mergeSearchResults(
    staticSearchIndex,
    serviceResults,
    projectResults(),
    digitalResults(digitalCards),
    blogResults,
  )

  return NextResponse.json({
    results: filterSearchResults(index, q, limit),
  })
}
