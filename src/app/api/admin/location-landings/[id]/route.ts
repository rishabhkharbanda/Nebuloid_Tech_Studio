import { NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/auth/session'
import {
  deleteLocationLandingCms,
  getLocationLandingCmsById,
  upsertLocationLandingCms,
} from '@/lib/cms/queries'
import { analyzeBlogSeo } from '@/lib/cms/seo-analyzer'
import { apiErrorStatus, locationLandingInputSchema, parseWithZod } from '@/lib/cms/validation'
import { hasDatabase } from '@/db/client'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: Ctx) {
  try {
    await requireSessionUser()
    const { id } = await context.params
    const page = await getLocationLandingCmsById(id)
    if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const seo = analyzeBlogSeo({
      title: page.title,
      slug: page.slug,
      excerpt: page.metaDescription || page.heroIntro,
      body: [page.whatIsIt, page.conclusion, ...page.benefits, ...page.features].join('\n'),
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      focusKeyword: page.focusKeyword,
      featuredImageUrl: page.ogImageUrl,
      featuredImageAlt: page.title,
      canonicalPath: page.canonicalPath || `/${page.slug}`,
      ogImageUrl: page.ogImageUrl,
      robotsIndex: page.robotsIndex,
    })
    return NextResponse.json({ page, seo })
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
    const input = parseWithZod(locationLandingInputSchema, body)
    const page = await upsertLocationLandingCms(id, input)
    const seo = analyzeBlogSeo({
      title: page.title,
      slug: page.slug,
      excerpt: page.metaDescription || page.heroIntro,
      body: [page.whatIsIt, page.conclusion, ...page.benefits, ...page.features].join('\n'),
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      focusKeyword: page.focusKeyword,
      featuredImageUrl: page.ogImageUrl,
      featuredImageAlt: page.title,
      canonicalPath: page.canonicalPath || `/${page.slug}`,
      ogImageUrl: page.ogImageUrl,
      robotsIndex: page.robotsIndex,
    })
    return NextResponse.json({ page, seo })
  } catch (error) {
    const { status, message } = apiErrorStatus(error)
    return NextResponse.json({ error: message }, { status })
  }
}

export async function DELETE(_request: Request, context: Ctx) {
  try {
    await requireSessionUser(['admin'])
    const { id } = await context.params
    await deleteLocationLandingCms(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const { status, message } = apiErrorStatus(error)
    return NextResponse.json({ error: message }, { status })
  }
}
