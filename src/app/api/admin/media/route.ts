import { NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/auth/session'
import { listMediaAssets } from '@/lib/cms/queries'
import { hasDatabase } from '@/db/client'

export async function GET(request: Request) {
  try {
    await requireSessionUser()
    if (!hasDatabase()) {
      return NextResponse.json({ assets: [], cmsEnabled: false })
    }
    const { searchParams } = new URL(request.url)
    const folder = searchParams.get('folder') ?? undefined
    const assets = await listMediaAssets(folder)
    return NextResponse.json({ assets, cmsEnabled: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error'
    const status = message === 'UNAUTHORIZED' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
