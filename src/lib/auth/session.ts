import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { eq } from 'drizzle-orm'
import { getDb, hasDatabase } from '@/db/client'
import { adminUsers, type AdminUser } from '@/db/schema'
import { verifyPassword } from '@/lib/auth/password'

export type SessionUser = {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor'
}

const COOKIE_NAME = 'nebuloid_admin_session'
const SESSION_TTL = '7d'

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim()
  if (!secret || secret.length < 32) {
    throw new Error('ADMIN_SESSION_SECRET must be at least 32 characters')
  }
  return new TextEncoder().encode(secret)
}

export async function createSessionToken(user: SessionUser) {
  return new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(getSecret())
}

export async function setSessionCookie(token: string) {
  const jar = await cookies()
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearSessionCookie() {
  const jar = await cookies()
  jar.delete(COOKIE_NAME)
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const jar = await cookies()
    const token = jar.get(COOKIE_NAME)?.value
    if (!token) return null
    const { payload } = await jwtVerify(token, getSecret())
    if (!payload.sub || typeof payload.email !== 'string') return null
    const role = payload.role === 'admin' ? 'admin' : 'editor'
    return {
      id: payload.sub,
      email: payload.email,
      name: typeof payload.name === 'string' ? payload.name : 'Admin',
      role,
    }
  } catch {
    return null
  }
}

export async function requireSessionUser(roles?: Array<'admin' | 'editor'>) {
  const user = await getSessionUser()
  if (!user) {
    throw new Error('UNAUTHORIZED')
  }
  if (roles && !roles.includes(user.role)) {
    throw new Error('FORBIDDEN')
  }
  return user
}

export async function authenticateAdmin(
  email: string,
  password: string,
): Promise<AdminUser | null> {
  if (!hasDatabase()) return null
  const db = getDb()
  const normalized = email.trim().toLowerCase()
  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, normalized))
    .limit(1)
  if (!user) return null
  const ok = await verifyPassword(password, user.passwordHash)
  if (!ok) return null
  return user
}

export function toSessionUser(user: AdminUser): SessionUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role === 'admin' ? 'admin' : 'editor',
  }
}
