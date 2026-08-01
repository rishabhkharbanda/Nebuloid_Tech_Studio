import { config } from 'dotenv'
config({ path: '.env.local' })

import { interactiveExperienceProducts } from '../src/lib/interactive-experience-products'
import {
  listExperienceServicesCms,
  upsertExperienceServiceCms,
} from '../src/lib/cms/queries'

async function main() {
  const existing = await listExperienceServicesCms(true)
  const bySlug = new Map(existing.map((row) => [row.slug, row]))
  let created = 0
  let updated = 0

  for (const [index, product] of interactiveExperienceProducts.entries()) {
    const current = bySlug.get(product.slug)
    await upsertExperienceServiceCms(current?.id ?? null, {
      title: product.title,
      slug: product.slug,
      description: product.description,
      detail: product.detail,
      tags: [...product.tags],
      imageUrl: product.image,
      imageAlt: product.imageAlt,
      intro: product.intro,
      sections: product.sections.map((section) => ({
        title: section.title,
        content: section.content,
      })),
      highlights: [...product.highlights],
      displayLabel: product.id,
      displayOrder: 6 + index,
      enabled: true,
      status: 'published',
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      focusKeyword: product.focusKeyword,
      canonicalPath: `/experiences/${product.slug}`,
      ogImageUrl: product.image,
      twitterImageUrl: product.image,
      robotsIndex: true,
      schemaType: 'Service',
    })
    if (current) updated += 1
    else created += 1
    console.log(`${current ? 'updated' : 'created'}: ${product.slug}`)
  }

  console.log(`Done. created=${created} updated=${updated} total=${interactiveExperienceProducts.length}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
