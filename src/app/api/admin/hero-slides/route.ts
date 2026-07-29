import { NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/auth/session'
import {
  listHeroSlidesCms,
  reorderHeroSlidesCms,
  upsertHeroSlideCms,
} from '@/lib/cms/queries'
import {
  apiErrorStatus,
  heroSlideInputSchema,
  parseWithZod,
  reorderHeroSlidesSchema,
} from '@/lib/cms/validation'
import { hasDatabase } from '@/db/client'

export async function GET() {
  try {
    await requireSessionUser()
    if (!hasDatabase()) {
      return NextResponse.json({ slides: [], cmsEnabled: false })
    }
    const slides = await listHeroSlidesCms(true)
    return NextResponse.json({ slides, cmsEnabled: true })
  } catch (error) {
    const { status, message } = apiErrorStatus(error)
    return NextResponse.json({ error: message }, { status })
  }
}

export async function POST(request: Request) {
  try {
    await requireSessionUser()
    if (!hasDatabase()) {
      return NextResponse.json({ error: 'DATABASE_URL is not configured.' }, { status: 503 })
    }
    const body = await request.json()
    if (Array.isArray(body.orderedIds)) {
      const { orderedIds } = parseWithZod(reorderHeroSlidesSchema, body)
      await reorderHeroSlidesCms(orderedIds)
      const slides = await listHeroSlidesCms(true)
      return NextResponse.json({ slides })
    }
    const input = parseWithZod(heroSlideInputSchema, body)
    const slide = await upsertHeroSlideCms(null, input)
    return NextResponse.json({ slide })
  } catch (error) {
    const { status, message } = apiErrorStatus(error)
    return NextResponse.json({ error: message }, { status })
  }
}
