import { NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/auth/session'
import { listExperienceServicesCms, upsertExperienceServiceCms } from '@/lib/cms/queries'
import { apiErrorStatus } from '@/lib/cms/validation'
import { serviceDetails } from '@/lib/detail-content'
import { interactiveExperienceSeoBySlug } from '@/lib/interactive-experience-products'
import { services } from '@/lib/site-data'
import { hasDatabase } from '@/db/client'

export async function POST() {
  try {
    await requireSessionUser()
    if (!hasDatabase()) {
      return NextResponse.json({ error: 'DATABASE_URL is not configured.' }, { status: 503 })
    }

    const existing = await listExperienceServicesCms(true)
    const existingSlugs = new Set(existing.map((row) => row.slug))
    let imported = 0

    for (const [index, service] of services.entries()) {
      if (existingSlugs.has(service.slug)) continue
      const details = serviceDetails[service.slug]
      const seo = interactiveExperienceSeoBySlug[service.slug]
      await upsertExperienceServiceCms(null, {
        title: service.title,
        slug: service.slug,
        description: service.description,
        detail: service.detail,
        tags: [...service.tags],
        imageUrl: service.image,
        imageAlt: seo?.imageAlt || `${service.title} — event experience by Nebuloid Tech Studio`,
        intro: details?.intro ?? service.description,
        sections: details?.sections ?? [],
        highlights: details?.highlights ?? [],
        displayLabel: service.id,
        displayOrder: index,
        enabled: true,
        status: 'published',
        metaTitle: seo?.metaTitle || service.title,
        metaDescription: seo?.metaDescription || details?.intro || service.description,
        focusKeyword: seo?.focusKeyword || '',
        canonicalPath: seo?.canonicalPath || `/experiences/${service.slug}`,
        ogImageUrl: service.image,
        robotsIndex: true,
        schemaType: 'Service',
      })
      imported += 1
    }

    return NextResponse.json({ imported })
  } catch (error) {
    const { status, message } = apiErrorStatus(error)
    return NextResponse.json({ error: message }, { status })
  }
}
