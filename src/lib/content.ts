import {
  getPublishedBlogBySlug,
  getPublishedBlogPostsCms,
  getPublishedDigitalBySlug,
  listDigitalCardsCms,
  mapCmsBlogToPublic,
  mapCmsDigitalToPublic,
  cmsEnabled,
} from '@/lib/cms/queries'
import type { PublicDigitalProject } from '@/lib/cms/types'
import { digitalProjects } from '@/lib/digital-data'
import {
  blogPosts,
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

export function getProjectBySlug(slug: string) {
  const project = projects.find((item) => item.slug === slug)
  if (!project) return null
  const details = projectDetails[slug]
  if (!details) return null
  return { ...project, ...details }
}

export function getServiceBySlug(slug: string) {
  const service = services.find((item) => item.slug === slug)
  if (!service) return null
  const details = serviceDetails[slug]
  if (!details) return null
  return { ...service, ...details }
}

function getStaticBlogPostBySlug(slug: string) {
  const post = blogPosts.find((item) => item.slug === slug)
  if (!post) return null
  const details = blogDetails[slug]
  if (!details) return null
  return {
    ...post,
    ...details,
    imageAlt: '',
    metaTitle: post.title,
    metaDescription: post.excerpt,
    bodyHtml: '',
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

export function getAllServiceSlugs() {
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
    return {
      ...post,
      image: details?.image ?? '',
      imageAlt: '',
      metaTitle: post.title,
      metaDescription: post.excerpt,
      body: details?.body ?? [],
      bodyHtml: '',
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
