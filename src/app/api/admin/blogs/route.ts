import { NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/auth/session'
import { listBlogPostsCms, upsertBlogPostCms } from '@/lib/cms/queries'
import { analyzeBlogSeo } from '@/lib/cms/seo-analyzer'
import { apiErrorStatus, blogInputSchema, parseWithZod } from '@/lib/cms/validation'
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
    const { status, message } = apiErrorStatus(error)
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
    const input = parseWithZod(blogInputSchema, body)
    const post = await upsertBlogPostCms(null, {
      ...input,
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
    const { status, message } = apiErrorStatus(error)
    return NextResponse.json({ error: message }, { status })
  }
}
