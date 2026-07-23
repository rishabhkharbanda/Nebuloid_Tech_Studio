import { NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/auth/session'
import {
  listDigitalCardsCms,
  reorderDigitalCardsCms,
  upsertDigitalCardCms,
} from '@/lib/cms/queries'
import { hasDatabase } from '@/db/client'

export async function GET() {
  try {
    await requireSessionUser()
    if (!hasDatabase()) {
      return NextResponse.json({ cards: [], cmsEnabled: false })
    }
    const cards = await listDigitalCardsCms(true)
    return NextResponse.json({ cards, cmsEnabled: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error'
    const status = message === 'UNAUTHORIZED' ? 401 : 500
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
      await reorderDigitalCardsCms(body.orderedIds as string[])
      const cards = await listDigitalCardsCms(true)
      return NextResponse.json({ cards })
    }
    const card = await upsertDigitalCardCms(null, body)
    return NextResponse.json({ card })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error'
    const status = message === 'UNAUTHORIZED' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
