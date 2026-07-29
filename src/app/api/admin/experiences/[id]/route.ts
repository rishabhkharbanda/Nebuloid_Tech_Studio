import { NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/auth/session'
import {
  deleteExperienceServiceCms,
  getExperienceServiceCmsById,
  upsertExperienceServiceCms,
} from '@/lib/cms/queries'
import { apiErrorStatus, experienceServiceInputSchema, parseWithZod } from '@/lib/cms/validation'
import { hasDatabase } from '@/db/client'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: Ctx) {
  try {
    await requireSessionUser()
    const { id } = await context.params
    const service = await getExperienceServiceCmsById(id)
    if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ service })
  } catch (error) {
    const { status, message } = apiErrorStatus(error)
    return NextResponse.json({ error: message }, { status })
  }
}

export async function PUT(request: Request, context: Ctx) {
  try {
    await requireSessionUser()
    if (!hasDatabase()) {
      return NextResponse.json({ error: 'DATABASE_URL is not configured.' }, { status: 503 })
    }
    const { id } = await context.params
    const body = await request.json()
    const input = parseWithZod(experienceServiceInputSchema, body)
    const service = await upsertExperienceServiceCms(id, input)
    return NextResponse.json({ service })
  } catch (error) {
    const { status, message } = apiErrorStatus(error)
    return NextResponse.json({ error: message }, { status })
  }
}

export async function DELETE(_request: Request, context: Ctx) {
  try {
    await requireSessionUser(['admin'])
    const { id } = await context.params
    await deleteExperienceServiceCms(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const { status, message } = apiErrorStatus(error)
    return NextResponse.json({ error: message }, { status })
  }
}
