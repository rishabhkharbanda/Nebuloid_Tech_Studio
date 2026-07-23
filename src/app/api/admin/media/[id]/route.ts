import { del } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/auth/session'
import { deleteMediaAsset, updateMediaAsset } from '@/lib/cms/queries'

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, context: Ctx) {
  try {
    await requireSessionUser()
    const { id } = await context.params
    const body = await request.json()
    const asset = await updateMediaAsset(id, body)
    return NextResponse.json({ asset })
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
    const asset = await deleteMediaAsset(id)
    if (asset?.url && process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        await del(asset.url)
      } catch {
        // Keep DB deletion even if blob cleanup fails.
      }
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error'
    const status = message === 'UNAUTHORIZED' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
