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

export function getBlogPostBySlug(slug: string) {
  const post = blogPosts.find((item) => item.slug === slug)
  if (!post) return null
  const details = blogDetails[slug]
  if (!details) return null
  return { ...post, ...details }
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

export function getAllBlogSlugs() {
  return blogPosts.map((post) => post.slug)
}

export function getAllIndustrySlugs() {
  return industries.map((industry) => industry.slug)
}

export function getAllTechnologySlugs() {
  return technologies.map((technology) => technology.slug)
}

export function getDigitalProjectBySlug(slug: string) {
  return digitalProjects.find((project) => project.slug === slug) ?? null
}

export function getAllDigitalProjectSlugs() {
  return digitalProjects.map((project) => project.slug)
}
