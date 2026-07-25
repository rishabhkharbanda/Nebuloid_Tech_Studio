import { NextResponse } from 'next/server'
import { siteConfig } from '@/lib/seo'

export const dynamic = 'force-static'

/** Permanent removal with a real HTTP 410 for crawlers. */
export function GET() {
  const html = `<!DOCTYPE html>
<html lang="en-IN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Content Removed | ${siteConfig.shortName}</title>
  <style>
    body{margin:0;font-family:system-ui,sans-serif;background:#090909;color:#F1E9DB;display:grid;min-height:100vh;place-items:center;padding:2rem}
    main{max-width:40rem}
    p.kicker{letter-spacing:.22em;text-transform:uppercase;font-size:.75rem;color:#d4af37}
    h1{font-size:clamp(2rem,6vw,3.5rem);line-height:1;margin:.75rem 0 1rem}
    a{color:#F1E9DB;text-decoration:none;border:1px solid rgba(241,233,219,.25);border-radius:999px;padding:.75rem 1.25rem;display:inline-block;margin-top:1.5rem}
  </style>
</head>
<body>
  <main>
    <p class="kicker">410</p>
    <h1>This content has been permanently removed.</h1>
    <p>The page you requested is gone and will not return. Continue exploring current services and blogs.</p>
    <a href="/">Return home</a>
  </main>
</body>
</html>`

  return new NextResponse(html, {
    status: 410,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
