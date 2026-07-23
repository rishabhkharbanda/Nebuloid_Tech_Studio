import { NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/auth/session'
import {
  listDigitalCardsCms,
  reorderDigitalCardsCms,
  upsertDigitalCardCms,
} from '@/lib/cms/queries'
import {
  apiErrorStatus,
  digitalCardInputSchema,
  parseWithZod,
  reorderDigitalSchema,
} from '@/lib/cms/validation'
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
      const { orderedIds } = parseWithZod(reorderDigitalSchema, body)
      await reorderDigitalCardsCms(orderedIds)
      const cards = await listDigitalCardsCms(true)
      return NextResponse.json({ cards })
    }
    const input = parseWithZod(digitalCardInputSchema, body)
    const card = await upsertDigitalCardCms(null, input)
    return NextResponse.json({ card })
  } catch (error) {
    const { status, message } = apiErrorStatus(error)
    return NextResponse.json({ error: message }, { status })
  }
}
