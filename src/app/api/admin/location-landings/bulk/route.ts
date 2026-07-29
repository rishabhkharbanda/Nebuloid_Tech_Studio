import { NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/auth/session'
import { listLocationLandingsCms, upsertLocationLandingCms } from '@/lib/cms/queries'
import { slugify } from '@/lib/cms/seo-analyzer'
import {
  apiErrorStatus,
  locationLandingBulkInputSchema,
  parseWithZod,
} from '@/lib/cms/validation'
import { hasDatabase } from '@/db/client'

export async function POST(request: Request) {
  try {
    await requireSessionUser()
    if (!hasDatabase()) {
      return NextResponse.json({ error: 'DATABASE_URL is not configured.' }, { status: 503 })
    }

    const body = await request.json()
    const input = parseWithZod(locationLandingBulkInputSchema, body)
    const defaultStatus = input.status ?? 'draft'
    const upsert = input.upsert !== false

    const existing = await listLocationLandingsCms()
    const bySlug = new Map(existing.map((row) => [row.slug, row]))

    const saved: Array<{ id: string; title: string; slug: string; status: string; action: string }> =
      []
    const failed: Array<{ title: string; error: string }> = []

    for (const pageInput of input.pages) {
      const slug = slugify(pageInput.slug || pageInput.title)
      const match = bySlug.get(slug)

      if (match && !upsert) {
        failed.push({
          title: pageInput.title,
          error: `Slug "${slug}" already exists — enable upsert to update.`,
        })
        continue
      }

      try {
        const page = await upsertLocationLandingCms(match?.id ?? null, {
          ...pageInput,
          slug,
          status: pageInput.status ?? defaultStatus,
          canonicalPath: pageInput.canonicalPath?.trim() || `/${slug}`,
          schemaType: pageInput.schemaType?.trim() || 'Service',
          robotsIndex: pageInput.robotsIndex ?? true,
        })
        bySlug.set(page.slug, page)
        saved.push({
          id: page.id,
          title: page.title,
          slug: page.slug,
          status: page.status,
          action: match ? 'updated' : 'created',
        })
      } catch (error) {
        failed.push({
          title: pageInput.title,
          error: error instanceof Error ? error.message : 'Failed to save landing',
        })
      }
    }

    return NextResponse.json({
      ok: failed.length === 0,
      savedCount: saved.length,
      failedCount: failed.length,
      saved,
      failed,
    })
  } catch (error) {
    const { status, message } = apiErrorStatus(error)
    return NextResponse.json({ error: message }, { status })
  }
}
