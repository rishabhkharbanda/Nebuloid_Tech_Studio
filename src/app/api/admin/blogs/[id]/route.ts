import { NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/auth/session'
import {
  deleteBlogPostCms,
  getBlogPostCmsById,
  upsertBlogPostCms,
} from '@/lib/cms/queries'
import { analyzeBlogSeo } from '@/lib/cms/seo-analyzer'
import { apiErrorStatus, blogInputSchema, parseWithZod } from '@/lib/cms/validation'
import { hasDatabase } from '@/db/client'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: Ctx) {
  try {
    await requireSessionUser()
    const { id } = await context.params
    const post = await getBlogPostCmsById(id)
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const seo = analyzeBlogSeo({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      body: post.bodyHtml || post.body,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      focusKeyword: post.focusKeyword,
      featuredImageUrl: post.featuredImageUrl,
      featuredImageAlt: post.featuredImageAlt,
    })
    return NextResponse.json({ post, seo })
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
    const input = parseWithZod(blogInputSchema, body)
    const post = await upsertBlogPostCms(id, input)
    const seo = analyzeBlogSeo({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      body: post.bodyHtml || post.body,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      focusKeyword: post.focusKeyword,
      featuredImageUrl: post.featuredImageUrl,
      featuredImageAlt: post.featuredImageAlt,
    })
    return NextResponse.json({ post, seo })
  } catch (error) {
    const { status, message } = apiErrorStatus(error)
    return NextResponse.json({ error: message }, { status })
  }
}

export async function DELETE(_request: Request, context: Ctx) {
  try {
    await requireSessionUser(['admin'])
    const { id } = await context.params
    await deleteBlogPostCms(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const { status, message } = apiErrorStatus(error)
    return NextResponse.json({ error: message }, { status })
  }
}
