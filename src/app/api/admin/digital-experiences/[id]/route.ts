import { NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/auth/session'
import {
  deleteDigitalCardCms,
  getDigitalCardCmsById,
  upsertDigitalCardCms,
} from '@/lib/cms/queries'
import { apiErrorStatus, digitalCardInputSchema, parseWithZod } from '@/lib/cms/validation'
import { hasDatabase } from '@/db/client'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: Ctx) {
  try {
    await requireSessionUser()
    const { id } = await context.params
    const card = await getDigitalCardCmsById(id)
    if (!card) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ card })
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
    const input = parseWithZod(digitalCardInputSchema, body)
    const card = await upsertDigitalCardCms(id, input)
    return NextResponse.json({ card })
  } catch (error) {
    const { status, message } = apiErrorStatus(error)
    return NextResponse.json({ error: message }, { status })
  }
}

export async function DELETE(_request: Request, context: Ctx) {
  try {
    await requireSessionUser(['admin'])
    const { id } = await context.params
    await deleteDigitalCardCms(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const { status, message } = apiErrorStatus(error)
    return NextResponse.json({ error: message }, { status })
  }
}
