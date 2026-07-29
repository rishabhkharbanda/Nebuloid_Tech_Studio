import {
  getPublishedBlogBySlug,
  getPublishedBlogPostsCms,
  getPublishedDigitalBySlug,
  getPublishedExperienceBySlug,
  listDigitalCardsCms,
  listExperienceServicesCms,
  listHeroSlidesCms,
  mapCmsBlogToPublic,
  mapCmsDigitalToPublic,
  mapCmsExperienceToPublic,
  mapCmsHeroSlideToPublic,
  cmsEnabled,
} from '@/lib/cms/queries'
import type { PublicDigitalProject, PublicExperienceService, PublicHeroSlide } from '@/lib/cms/types'
import { digitalProjects } from '@/lib/digital-data'
import {
  blogPosts,
  defaultHeroDescription,
  heroStates,
  industries,
  projects,
  services,
  technologies,
} from '@/lib/site-data'
import {
  blogDetails,
  industryDetails,
  projectDetails,
  serviceDetails,
  technologyDetails,
} from '@/lib/detail-content'
import { parseBlogDate } from '@/lib/seo'

export function getProjectBySlug(slug: string) {
  const project = projects.find((item) => item.slug === slug)
  if (!project) return null
  const details = projectDetails[slug]
  if (!details) return null
  return { ...project, ...details }
}

export function getStaticServiceBySlug(slug: string) {
  const service = services.find((item) => item.slug === slug)
  if (!service) return null
  const details = serviceDetails[slug]
  if (!details) return null
  return { ...service, ...details }
}

/** @deprecated Use getServiceBySlug — sync fallback only. */
export function getServiceBySlug(slug: string) {
  return getStaticServiceBySlug(slug)
}

export async function getExperienceServiceBySlug(
  slug: string,
): Promise<PublicExperienceService | null> {
  if (cmsEnabled()) {
    try {
      const cms = await getPublishedExperienceBySlug(slug)
      if (cms) {
        const all = await listExperienceServicesCms(false)
        const index = all.findIndex((row) => row.slug === slug)
        return mapCmsExperienceToPublic(cms, index >= 0 ? index : 0)
      }
    } catch {
      // Fall through.
    }
  }
  const staticService = getStaticServiceBySlug(slug)
  if (!staticService) return null
  const index = services.findIndex((item) => item.slug === slug)
  return {
    id: staticService.id,
    slug: staticService.slug,
    title: staticService.title,
    description: staticService.description,
    detail: staticService.detail,
    tags: [...staticService.tags],
    image: staticService.image,
    imageAlt: `${staticService.title} — event experience by Nebuloid Tech Studio`,
    intro: staticService.intro,
    sections: staticService.sections.map((section) => ({ ...section })),
    highlights: [...staticService.highlights],
  }
}

export async function getExperienceServices(): Promise<PublicExperienceService[]> {
  if (cmsEnabled()) {
    try {
      const rows = await listExperienceServicesCms(false)
      if (rows.length > 0) {
        return rows.map((row, index) => mapCmsExperienceToPublic(row, index))
      }
    } catch {
      // Fall through.
    }
  }

  return services.map((service, index) => {
    const details = serviceDetails[service.slug]
    return {
      id: service.id,
      slug: service.slug,
      title: service.title,
      description: service.description,
      detail: service.detail,
      tags: [...service.tags],
      image: service.image,
      imageAlt: `${service.title} — event experience by Nebuloid Tech Studio`,
      intro: details?.intro ?? service.description,
      sections: details?.sections.map((section) => ({ ...section })) ?? [],
      highlights: details?.highlights ? [...details.highlights] : [],
    }
  })
}

export async function getHeroSlides(): Promise<PublicHeroSlide[]> {
  if (cmsEnabled()) {
    try {
      const rows = await listHeroSlidesCms(false)
      if (rows.length > 0) {
        return rows.map((row) => {
          const mapped = mapCmsHeroSlideToPublic(row)
          return {
            ...mapped,
            description: mapped.description || defaultHeroDescription,
          }
        })
      }
    } catch {
      // Fall through.
    }
  }

  return heroStates.map((slide, index) => ({
    id: `static-hero-${index}`,
    title: slide.title,
    description: defaultHeroDescription,
    image: slide.image,
    imageAlt: `${slide.title.replace(/\.$/, '')} — event experience by Nebuloid Tech Studio`,
    classes: slide.classes,
  }))
}

function getStaticBlogPostBySlug(slug: string) {
  const post = blogPosts.find((item) => item.slug === slug)
  if (!post) return null
  const details = blogDetails[slug]
  if (!details) return null
  const datePublished = parseBlogDate(post.date)
  return {
    ...post,
    ...details,
    imageAlt: '',
    metaTitle: post.title,
    metaDescription: post.excerpt,
    bodyHtml: '',
    datePublished,
    dateModified: datePublished,
    tags: [] as string[],
    focusKeyword: '',
    canonicalPath: `/insights/${post.slug}`,
    ogImageUrl: details.image ?? '',
    twitterImageUrl: details.image ?? '',
    robotsIndex: true,
    authorName: 'Nebuloid Tech Studio',
    schemaType: 'BlogPosting',
  }
}

export async function getBlogPostBySlug(slug: string) {
  if (cmsEnabled()) {
    try {
      const cmsPost = await getPublishedBlogBySlug(slug)
      if (cmsPost) return mapCmsBlogToPublic(cmsPost)
    } catch {
      // Fall through to static content.
    }
  }
  return getStaticBlogPostBySlug(slug)
}

/** Sync helper for generateStaticParams fallback paths. */
export function getBlogPostBySlugSync(slug: string) {
  return getStaticBlogPostBySlug(slug)
}

export function getIndustryBySlug(slug: string) {
  const industry = industries.find((item) => item.slug === slug)
  if (!industry) return null
  const details = industryDetails[slug]
  if (!details) return null
  return { ...industry, ...details }
}

export function getTechnologyBySlug(slug: string) {
  const technology = technologies.find((item) => item.slug === slug)
  if (!technology) return null
  const details = technologyDetails[slug]
  if (!details) return null
  return { ...technology, ...details }
}

export function getAllProjectSlugs() {
  return projects.map((project) => project.slug)
}

export async function getAllServiceSlugs() {
  const staticSlugs = services.map((service) => service.slug)
  if (!cmsEnabled()) return staticSlugs
  try {
    const rows = await listExperienceServicesCms(false)
    return Array.from(new Set([...rows.map((row) => row.slug), ...staticSlugs]))
  } catch {
    return staticSlugs
  }
}

export function getAllServiceSlugsSync() {
  return services.map((service) => service.slug)
}

export async function getAllBlogSlugs() {
  const staticSlugs = blogPosts.map((post) => post.slug)
  if (!cmsEnabled()) return staticSlugs
  try {
    const cmsPosts = await getPublishedBlogPostsCms()
    return Array.from(new Set([...cmsPosts.map((post) => post.slug), ...staticSlugs]))
  } catch {
    return staticSlugs
  }
}

export function getAllBlogSlugsSync() {
  return blogPosts.map((post) => post.slug)
}

export async function getBlogPostsForListing() {
  const staticList = blogPosts.map((post) => {
    const details = blogDetails[post.slug]
    const datePublished = parseBlogDate(post.date)
    return {
      ...post,
      image: details?.image ?? '',
      imageAlt: '',
      metaTitle: post.title,
      metaDescription: post.excerpt,
      body: details?.body ?? [],
      bodyHtml: '',
      datePublished,
      dateModified: datePublished,
      tags: [] as string[],
      focusKeyword: '',
      canonicalPath: `/insights/${post.slug}`,
      ogImageUrl: details?.image ?? '',
      twitterImageUrl: details?.image ?? '',
      robotsIndex: true,
      authorName: 'Nebuloid Tech Studio',
      schemaType: 'BlogPosting',
    }
  })

  if (cmsEnabled()) {
    try {
      const cmsPosts = await getPublishedBlogPostsCms()
      if (cmsPosts.length > 0) {
        const cmsMapped = cmsPosts.map(mapCmsBlogToPublic)
        const cmsSlugs = new Set(cmsMapped.map((post) => post.slug))
        return [...cmsMapped, ...staticList.filter((post) => !cmsSlugs.has(post.slug))]
      }
    } catch {
      // Fall through.
    }
  }

  return staticList
}

export async function getRelatedBlogPosts(slug: string, limit = 3) {
  const posts = await getBlogPostsForListing()
  const current = posts.find((post) => post.slug === slug)
  if (!current) return posts.filter((post) => post.slug !== slug).slice(0, limit)
  const sameCategory = posts.filter(
    (post) => post.slug !== slug && post.category === current.category,
  )
  const rest = posts.filter(
    (post) => post.slug !== slug && post.category !== current.category,
  )
  return [...sameCategory, ...rest].slice(0, limit)
}

export function getAllIndustrySlugs() {
  return industries.map((industry) => industry.slug)
}

export function getAllTechnologySlugs() {
  return technologies.map((technology) => technology.slug)
}

function mapStaticDigitalProject(slug: string): PublicDigitalProject | null {
  const project = digitalProjects.find((item) => item.slug === slug)
  if (!project) return null
  const interactive =
    'interactiveExperiences' in project
      ? {
          aiBooth:
            'aiBooth' in project.interactiveExperiences
              ? [...project.interactiveExperiences.aiBooth]
              : undefined,
          games:
            'games' in project.interactiveExperiences
              ? [...project.interactiveExperiences.games]
              : undefined,
          technologies:
            'technologies' in project.interactiveExperiences
              ? [...project.interactiveExperiences.technologies]
              : undefined,
        }
      : undefined
  return {
    slug: project.slug,
    client: project.client,
    subtitle: 'subtitle' in project ? project.subtitle : undefined,
    category: project.category,
    title: project.title,
    overview: project.overview,
    image: project.image,
    galleryTitle: 'galleryTitle' in project ? project.galleryTitle : undefined,
    galleryHeading: 'galleryHeading' in project ? project.galleryHeading : undefined,
    galleryAspect: 'galleryAspect' in project ? project.galleryAspect : undefined,
    gallery: 'gallery' in project ? project.gallery.map((item) => ({ ...item })) : [],
    contribution: [...project.contribution],
    interactiveExperiences: interactive,
    techStack: [...project.techStack],
    impact: [...project.impact],
  }
}

export async function getDigitalProjectBySlug(slug: string): Promise<PublicDigitalProject | null> {
  if (cmsEnabled()) {
    try {
      const cms = await getPublishedDigitalBySlug(slug)
      const hasCaseStudy =
        Boolean(cms) &&
        (((cms!.gallery?.length ?? 0) > 0) ||
          ((cms!.contribution?.length ?? 0) > 0) ||
          ((cms!.impact?.length ?? 0) > 0) ||
          ((cms!.techStack?.length ?? 0) > 0))
      if (cms && hasCaseStudy) {
        return mapCmsDigitalToPublic(cms)
      }
    } catch {
      // Fall through.
    }
  }
  return mapStaticDigitalProject(slug)
}

export function getDigitalProjectBySlugSync(slug: string) {
  return mapStaticDigitalProject(slug)
}

export async function getAllDigitalProjectSlugs() {
  const staticSlugs = digitalProjects.map((project) => project.slug)
  if (!cmsEnabled()) return staticSlugs
  try {
    const cards = await listDigitalCardsCms(false)
    return Array.from(new Set([...cards.map((card) => card.slug), ...staticSlugs]))
  } catch {
    return staticSlugs
  }
}

export function getAllDigitalProjectSlugsSync() {
  return digitalProjects.map((project) => project.slug)
}

export type PublicDigitalCard = {
  slug: string
  title: string
  overview: string
  image: string
  imageAlt: string
  category: string
  client: string
  ctaText: string
  ctaHref: string
}

export async function getDigitalExperienceCards(): Promise<PublicDigitalCard[]> {
  if (cmsEnabled()) {
    try {
      const cards = await listDigitalCardsCms(false)
      if (cards.length > 0) {
        return cards.map((card) => ({
          slug: card.slug,
          title: card.title,
          overview: card.shortDescription,
          image: card.imageUrl,
          imageAlt: card.imageAlt || card.title,
          category: card.category,
          client: card.clientLabel || card.category,
          ctaText: card.ctaText,
          ctaHref: card.ctaHref || `/digital-experiences/${card.slug}`,
        }))
      }
    } catch {
      // Fall through.
    }
  }

  return digitalProjects.map((project) => ({
    slug: project.slug,
    title: project.title,
    overview: project.overview,
    image: project.image,
    imageAlt: project.client,
    category: project.category,
    client: project.client,
    ctaText: 'View Case Study',
    ctaHref: `/digital-experiences/${project.slug}`,
  }))
}
