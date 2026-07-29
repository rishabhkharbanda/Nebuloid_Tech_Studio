import { NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/auth/session'
import { listHeroSlidesCms, upsertHeroSlideCms } from '@/lib/cms/queries'
import { apiErrorStatus } from '@/lib/cms/validation'
import { defaultHeroDescription, heroStates } from '@/lib/site-data'
import { hasDatabase } from '@/db/client'

export async function POST() {
  try {
    await requireSessionUser()
    if (!hasDatabase()) {
      return NextResponse.json({ error: 'DATABASE_URL is not configured.' }, { status: 503 })
    }

    const existing = await listHeroSlidesCms(true)
    const existingTitles = new Set(existing.map((row) => row.title.trim().toLowerCase()))
    let imported = 0

    for (const [index, slide] of heroStates.entries()) {
      if (existingTitles.has(slide.title.trim().toLowerCase())) continue
      await upsertHeroSlideCms(null, {
        title: slide.title,
        description: defaultHeroDescription,
        imageUrl: slide.image,
        imageAlt: `${slide.title.replace(/\.$/, '')} — event experience by Nebuloid Tech Studio`,
        overlayClasses: slide.classes,
        displayOrder: index,
        enabled: true,
        status: 'published',
      })
      imported += 1
    }

    return NextResponse.json({ imported })
  } catch (error) {
    const { status, message } = apiErrorStatus(error)
    return NextResponse.json({ error: message }, { status })
  }
}
