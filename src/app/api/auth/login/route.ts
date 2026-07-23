import { NextResponse } from 'next/server'
import {
  authenticateAdmin,
  createSessionToken,
  setSessionCookie,
  toSessionUser,
} from '@/lib/auth/session'
import { hasDatabase } from '@/db/client'

function hasSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim()
  return Boolean(secret && secret.length >= 32)
}

export async function POST(request: Request) {
  try {
    if (!hasDatabase()) {
      return NextResponse.json(
        {
          error:
            'CMS database is not configured on this environment. Add DATABASE_URL in Vercel project settings, then redeploy.',
        },
        { status: 503 },
      )
    }

    if (!hasSessionSecret()) {
      return NextResponse.json(
        {
          error:
            'ADMIN_SESSION_SECRET is missing or too short on this environment. Add a 32+ character secret in Vercel, then redeploy.',
        },
        { status: 503 },
      )
    }

    const body = (await request.json()) as { email?: string; password?: string }
    const email = body.email?.trim() ?? ''
    const password = body.password ?? ''
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    const user = await authenticateAdmin(email, password)
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 })
    }

    const sessionUser = toSessionUser(user)
    const token = await createSessionToken(sessionUser)
    await setSessionCookie(token)

    return NextResponse.json({ ok: true, user: sessionUser })
  } catch (error) {
    console.error('admin login failed', error)
    const detail = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Unable to sign in. ${detail}` },
      { status: 500 },
    )
  }
}
