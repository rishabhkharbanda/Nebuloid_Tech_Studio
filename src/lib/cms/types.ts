export type GalleryItemCms = {
  src: string
  alt: string
  label: string
}

export type InteractiveExperiencesCms = {
  aiBooth?: string[]
  games?: string[]
  technologies?: string[]
}

export type DetailSectionCms = {
  title: string
  content: string
}

export type PublicExperienceService = {
  id: string
  slug: string
  title: string
  description: string
  detail: string
  tags: string[]
  image: string
  imageAlt: string
  intro: string
  sections: DetailSectionCms[]
  highlights: string[]
  metaTitle?: string
  metaDescription?: string
  focusKeyword?: string
  canonicalPath?: string
  ogImageUrl?: string
  twitterImageUrl?: string
  robotsIndex?: boolean
  schemaType?: string
}

export type PublicDigitalProject = {
  slug: string
  client: string
  subtitle?: string
  category: string
  title: string
  overview: string
  image: string
  galleryTitle?: string
  galleryHeading?: string
  galleryAspect?: 'wide' | 'video'
  gallery: GalleryItemCms[]
  contribution: string[]
  interactiveExperiences?: InteractiveExperiencesCms
  techStack: string[]
  impact: string[]
  metaTitle?: string
  metaDescription?: string
  focusKeyword?: string
  canonicalPath?: string
  ogImageUrl?: string
  twitterImageUrl?: string
  robotsIndex?: boolean
  schemaType?: string
}
