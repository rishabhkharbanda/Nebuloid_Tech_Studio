import { NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/auth/session'
import {
  deleteDigitalCardCms,
  getDigitalCardCmsById,
  upsertDigitalCardCms,
} from '@/lib/cms/queries'
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
    const message = error instanceof Error ? error.message : 'Error'
    const status = message === 'UNAUTHORIZED' ? 401 : 500
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
    const card = await upsertDigitalCardCms(id, body)
    return NextResponse.json({ card })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error'
    const status = message === 'UNAUTHORIZED' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

export async function DELETE(_request: Request, context: Ctx) {
  try {
    await requireSessionUser()
    const { id } = await context.params
    await deleteDigitalCardCms(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error'
    const status = message === 'UNAUTHORIZED' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
