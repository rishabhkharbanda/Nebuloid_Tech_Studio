import { interactiveProductsBatch1 } from '@/lib/interactive-products-batch1'
import { interactiveProductsBatch2 } from '@/lib/interactive-products-batch2'
import { interactiveProductsBatch3 } from '@/lib/interactive-products-batch3'
import type { GeoEnrichment } from '@/lib/geo-enrichment'

export type InteractiveExperienceProduct = {
  id: string
  slug: string
  title: string
  description: string
  detail: string
  tags: readonly string[]
  image: string
  imageAlt: string
  intro: string
  metaTitle: string
  metaDescription: string
  focusKeyword: string
  highlights: readonly string[]
  sections: readonly { title: string; content: string }[]
  geo: GeoEnrichment
}

export const interactiveExperienceProducts: InteractiveExperienceProduct[] = [
  ...interactiveProductsBatch1,
  ...interactiveProductsBatch2,
  ...interactiveProductsBatch3,
] as unknown as InteractiveExperienceProduct[]

export const interactiveExperienceServiceCards = interactiveExperienceProducts.map(
  (product) => ({
    id: product.id,
    slug: product.slug,
    title: product.title,
    description: product.description,
    detail: product.detail,
    tags: [...product.tags],
    image: product.image,
  }),
)

export const interactiveExperienceServiceDetails = Object.fromEntries(
  interactiveExperienceProducts.map((product) => [
    product.slug,
    {
      intro: product.intro,
      sections: product.sections.map((section) => ({
        title: section.title,
        content: section.content,
      })),
      highlights: [...product.highlights],
    },
  ]),
) as Record<
  string,
  {
    intro: string
    sections: { title: string; content: string }[]
    highlights: string[]
  }
>

export const interactiveExperienceGeoBySlug = Object.fromEntries(
  interactiveExperienceProducts.map((product) => [product.slug, product.geo]),
) as Record<string, GeoEnrichment>

export const interactiveExperienceSeoBySlug = Object.fromEntries(
  interactiveExperienceProducts.map((product) => [
    product.slug,
    {
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      focusKeyword: product.focusKeyword,
      imageAlt: product.imageAlt,
      canonicalPath: `/experiences/${product.slug}`,
    },
  ]),
)
