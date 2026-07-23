import { NextResponse } from 'next/server'
import { authenticateAdmin, createSessionToken, setSessionCookie, toSessionUser } from '@/lib/auth/session'
import { hasDatabase } from '@/db/client'

export async function POST(request: Request) {
  try {
    if (!hasDatabase()) {
      return NextResponse.json(
        { error: 'CMS database is not configured. Set DATABASE_URL first.' },
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
    return NextResponse.json({ error: 'Unable to sign in.' }, { status: 500 })
  }
}
