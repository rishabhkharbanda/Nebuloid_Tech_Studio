import { NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/auth/session'
import {
  listExperienceServicesCms,
  reorderExperienceServicesCms,
  upsertExperienceServiceCms,
} from '@/lib/cms/queries'
import {
  apiErrorStatus,
  experienceServiceInputSchema,
  parseWithZod,
  reorderExperienceServicesSchema,
} from '@/lib/cms/validation'
import { hasDatabase } from '@/db/client'

export async function GET() {
  try {
    await requireSessionUser()
    if (!hasDatabase()) {
      return NextResponse.json({ services: [], cmsEnabled: false })
    }
    const services = await listExperienceServicesCms(true)
    return NextResponse.json({ services, cmsEnabled: true })
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
      const { orderedIds } = parseWithZod(reorderExperienceServicesSchema, body)
      await reorderExperienceServicesCms(orderedIds)
      const services = await listExperienceServicesCms(true)
      return NextResponse.json({ services })
    }
    const input = parseWithZod(experienceServiceInputSchema, body)
    const service = await upsertExperienceServiceCms(null, input)
    return NextResponse.json({ service })
  } catch (error) {
    const { status, message } = apiErrorStatus(error)
    return NextResponse.json({ error: message }, { status })
  }
}
