import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'nebuloid_admin_session'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/gone') {
    const response = NextResponse.next()
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    // Signal permanent removal to crawlers that respect custom status via rewrite marker.
    response.headers.set('X-Nebuloid-Status', '410')
    return response
  }

  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(COOKIE_NAME)?.value
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  if (pathname.startsWith('/api/admin')) {
    const token = request.cookies.get(COOKIE_NAME)?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/gone'],
}
