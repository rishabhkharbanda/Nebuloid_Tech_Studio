/** Shared primary navigation — keep navbar and footer in sync. */
export const primaryNavLinks = [
  { label: 'Home', href: '/' },
  { label: 'Experiences We Offer', href: '/experiences' },
  { label: 'Our Work', href: '/digital-experiences' },
  { label: 'Blogs', href: '/insights' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const

export const navLabels = {
  experiencesWeOffer: 'Experiences We Offer',
  ourWork: 'Our Work',
  blogs: 'Blogs',
} as const
