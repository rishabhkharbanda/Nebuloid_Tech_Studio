import { NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/auth/session'
import { upsertSiteSettings } from '@/lib/cms/site-settings'
import { apiErrorStatus } from '@/lib/cms/validation'
import { hasDatabase } from '@/db/client'

export async function GET() {
  try {
    await requireSessionUser()
    if (!hasDatabase()) {
      return NextResponse.json({ cmsEnabled: false, error: 'DATABASE_URL is not configured.' }, { status: 503 })
    }
    const { getSiteSettings } = await import('@/lib/cms/site-settings')
    const settings = await getSiteSettings()
    return NextResponse.json({ ...settings, cmsEnabled: true })
  } catch (error) {
    const { status, message } = apiErrorStatus(error)
    return NextResponse.json({ error: message }, { status })
  }
}

export async function PUT(request: Request) {
  try {
    await requireSessionUser()
    if (!hasDatabase()) {
      return NextResponse.json({ error: 'DATABASE_URL is not configured.' }, { status: 503 })
    }
    const body = (await request.json()) as {
      whatsappEnabled?: boolean
      whatsappLink?: string
      whatsappPhone?: string
      whatsappMessage?: string
    }
    const settings = await upsertSiteSettings({
      whatsappEnabled: Boolean(body.whatsappEnabled),
      whatsappLink: body.whatsappLink ?? '',
      whatsappPhone: body.whatsappPhone ?? '',
      whatsappMessage: body.whatsappMessage ?? '',
    })
    return NextResponse.json(settings)
  } catch (error) {
    const { status, message } = apiErrorStatus(error)
    return NextResponse.json({ error: message }, { status })
  }
}
