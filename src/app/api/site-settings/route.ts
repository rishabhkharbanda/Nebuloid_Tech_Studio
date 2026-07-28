import { NextResponse } from 'next/server'
import { getSiteSettings } from '@/lib/cms/site-settings'

export const revalidate = 30

export async function GET() {
  const settings = await getSiteSettings()
  return NextResponse.json(settings)
}
