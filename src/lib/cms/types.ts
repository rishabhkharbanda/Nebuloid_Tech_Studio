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
}
