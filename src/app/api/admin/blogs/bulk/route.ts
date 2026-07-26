import { NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/auth/session'
import { upsertBlogPostCms } from '@/lib/cms/queries'
import { apiErrorStatus, blogBulkInputSchema, parseWithZod } from '@/lib/cms/validation'
import { hasDatabase } from '@/db/client'

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser()
    if (!hasDatabase()) {
      return NextResponse.json({ error: 'DATABASE_URL is not configured.' }, { status: 503 })
    }

    const body = await request.json()
    const input = parseWithZod(blogBulkInputSchema, body)
    const defaultStatus = input.status ?? 'draft'
    const defaultCategory = input.category?.trim() || ''

    const created: Array<{ id: string; title: string; slug: string; status: string }> = []
    const failed: Array<{ title: string; error: string }> = []

    for (const postInput of input.posts) {
      try {
        const post = await upsertBlogPostCms(null, {
          ...postInput,
          status: postInput.status ?? defaultStatus,
          category: postInput.category?.trim() || defaultCategory,
          bodyHtml: postInput.bodyHtml || postInput.body || '',
          body: postInput.body || postInput.bodyHtml || '',
          createdBy: user.id,
        })
        created.push({
          id: post.id,
          title: post.title,
          slug: post.slug,
          status: post.status,
        })
      } catch (error) {
        failed.push({
          title: postInput.title || 'Untitled',
          error: error instanceof Error ? error.message : 'Failed to create post',
        })
      }
    }

    return NextResponse.json({
      ok: failed.length === 0,
      createdCount: created.length,
      failedCount: failed.length,
      created,
      failed,
    })
  } catch (error) {
    const { status, message } = apiErrorStatus(error)
    return NextResponse.json({ error: message }, { status })
  }
}
