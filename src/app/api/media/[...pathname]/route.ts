import { get } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { getBlobAccess } from '@/lib/cms/blob'

type Ctx = { params: Promise<{ pathname: string[] }> }

export async function GET(_request: Request, context: Ctx) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: 'Blob is not configured.' }, { status: 503 })
    }

    const segments = (await context.params).pathname || []
    const pathname = segments.map((segment) => decodeURIComponent(segment)).join('/')
    if (!pathname) {
      return NextResponse.json({ error: 'Missing pathname.' }, { status: 400 })
    }

    const result = await get(pathname, { access: getBlobAccess() })
    if (!result) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 })
    }

    if (result.statusCode === 304 || !result.stream) {
      return new NextResponse(null, { status: 304 })
    }

    const headers = new Headers()
    const contentType = result.blob.contentType || 'application/octet-stream'
    headers.set('Content-Type', contentType)
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    if (typeof result.blob.size === 'number') {
      headers.set('Content-Length', String(result.blob.size))
    }

    return new NextResponse(result.stream, { status: 200, headers })
  } catch (error) {
    console.error('media proxy failed', error)
    const message = error instanceof Error ? error.message : 'Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
