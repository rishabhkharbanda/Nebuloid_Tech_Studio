import { NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/auth/session'
import { listBlogPostsCms, upsertBlogPostCms } from '@/lib/cms/queries'
import { analyzeBlogSeo } from '@/lib/cms/seo-analyzer'
import { hasDatabase } from '@/db/client'

export async function GET() {
  try {
    await requireSessionUser()
    if (!hasDatabase()) {
      return NextResponse.json({ posts: [], cmsEnabled: false })
    }
    const posts = await listBlogPostsCms()
    return NextResponse.json({ posts, cmsEnabled: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error'
    const status = message === 'UNAUTHORIZED' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser()
    if (!hasDatabase()) {
      return NextResponse.json({ error: 'DATABASE_URL is not configured.' }, { status: 503 })
    }
    const body = await request.json()
    const post = await upsertBlogPostCms(null, {
      ...body,
      createdBy: user.id,
    })
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
    const message = error instanceof Error ? error.message : 'Error'
    const status = message === 'UNAUTHORIZED' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
