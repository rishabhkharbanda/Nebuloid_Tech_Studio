import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [65, 70, 75],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'cdnasset.com',
      },
      {
        protocol: 'https',
        hostname: '**.cdnasset.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/solutions',
        destination: '/experiences',
        permanent: true,
      },
      {
        source: '/solutions/:slug',
        destination: '/experiences/:slug',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/insights',
        permanent: true,
      },
      {
        source: '/blog/:slug',
        destination: '/insights/:slug',
        permanent: true,
      },
      {
        source: '/blogs',
        destination: '/insights',
        permanent: true,
      },
      {
        source: '/blogs/:slug',
        destination: '/insights/:slug',
        permanent: true,
      },
      {
        source: '/ai-photo-booth',
        destination: '/technology/ai-photo-booths',
        permanent: true,
      },
      {
        source: '/ai-photobooth',
        destination: '/technology/ai-photo-booths',
        permanent: true,
      },
    ]
  },
  async headers() {
    // Keep allowlists explicit (no broad wildcards for script/frame) so analytics
    // works without widening XSS / data-exfiltration surface.
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      // Do not send X-Frame-Options: DENY — Meta Events Manager Event Setup Tool
      // embeds the site in an iframe. Framing is controlled via CSP frame-ancestors.
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Permissions-Policy',
        value:
          'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      // Keep browsing-context isolation without blocking third-party tag verification.
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "base-uri 'self'",
          "object-src 'none'",
          // Allow Meta Event Setup Tool to iframe the site; block other embedders.
          "frame-ancestors 'self' https://www.facebook.com https://web.facebook.com https://business.facebook.com https://*.facebook.com https://*.meta.com",
          "form-action 'self'",
          'upgrade-insecure-requests',
          // Scripts: first-party + Google tag / GTM / Ads + other marketing vendors.
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://vercel.live https://www.googletagmanager.com https://tagmanager.google.com https://www.google-analytics.com https://ssl.google-analytics.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com https://www.gstatic.com https://www.clarity.ms https://connect.facebook.net https://snap.licdn.com",
          "style-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://tagmanager.google.com",
          "img-src 'self' data: blob: https:",
          "font-src 'self' data:",
          // Beacons / XHR used by GA4, Ads, GTM, Clarity, Neon, Blob.
          "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://region1.google-analytics.com https://www.googletagmanager.com https://*.googletagmanager.com https://tagmanager.google.com https://www.google.com https://google.com https://stats.g.doubleclick.net https://ad.doubleclick.net https://googleads.g.doubleclick.net https://td.doubleclick.net https://www.googleadservices.com https://pagead2.googlesyndication.com https://www.clarity.ms https://*.clarity.ms https://connect.facebook.net https://www.facebook.com https://facebook.com https://*.facebook.com https://*.neon.tech https://*.blob.vercel-storage.com https://*.public.blob.vercel-storage.com",
          "frame-src 'self' https://www.google.com https://maps.google.com https://www.googletagmanager.com https://td.doubleclick.net https://googleads.g.doubleclick.net https://www.googleadservices.com",
          "media-src 'self' blob:",
          "worker-src 'self' blob:",
        ].join('; '),
      },
    ]

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/gone',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          ...securityHeaders,
        ],
      },
    ]
  },
}

export default nextConfig
