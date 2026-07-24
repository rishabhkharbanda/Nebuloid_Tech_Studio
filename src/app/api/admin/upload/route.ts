import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/auth/session'
import { getBlobAccess, mediaProxyPath } from '@/lib/cms/blob'
import { createMediaAsset } from '@/lib/cms/queries'
import { hasDatabase } from '@/db/client'

export async function POST(request: Request) {
  try {
    await requireSessionUser()
    if (!hasDatabase()) {
      return NextResponse.json({ error: 'DATABASE_URL is not configured.' }, { status: 503 })
    }
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'BLOB_READ_WRITE_TOKEN is not configured.' },
        { status: 503 },
      )
    }

    const form = await request.formData()
    const file = form.get('file')
    const alt = String(form.get('alt') ?? '')
    const folder = String(form.get('folder') ?? 'general')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File is required.' }, { status: 400 })
    }

    const access = getBlobAccess()
    const blob = await put(`cms/${folder}/${Date.now()}-${file.name}`, file, {
      access,
      contentType: file.type || undefined,
    })

    // Private blob URLs are not publicly readable — serve via our proxy for site/admin use.
    const url = access === 'private' ? mediaProxyPath(blob.pathname) : blob.url

    const asset = await createMediaAsset({
      url,
      pathname: blob.pathname,
      filename: file.name,
      alt,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      folder,
    })

    return NextResponse.json({ asset })
  } catch (error) {
    console.error('upload failed', error)
    const message = error instanceof Error ? error.message : 'Error'
    const status = message === 'UNAUTHORIZED' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
