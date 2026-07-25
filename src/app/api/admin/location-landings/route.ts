import { NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/auth/session'
import {
  listLocationLandingsCms,
  seedLocationLandingsFromStatic,
  upsertLocationLandingCms,
} from '@/lib/cms/queries'
import { apiErrorStatus, locationLandingInputSchema, parseWithZod } from '@/lib/cms/validation'
import { hasDatabase } from '@/db/client'
import { locationLandings } from '@/lib/location-landings'

export async function GET() {
  try {
    await requireSessionUser()
    const pages = await listLocationLandingsCms()
    return NextResponse.json({ pages })
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
    if (body?.action === 'seed-defaults') {
      const pages = await seedLocationLandingsFromStatic(locationLandings)
      return NextResponse.json({ pages })
    }
    const input = parseWithZod(locationLandingInputSchema, body)
    const page = await upsertLocationLandingCms(null, input)
    return NextResponse.json({ page })
  } catch (error) {
    const { status, message } = apiErrorStatus(error)
    return NextResponse.json({ error: message }, { status })
  }
}
