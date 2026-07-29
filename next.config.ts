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
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), payment=()',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "base-uri 'self'",
          "object-src 'none'",
          "frame-ancestors 'none'",
          "form-action 'self'",
          // Next.js + analytics (GA4, Google Ads, Clarity, Meta, LinkedIn).
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://vercel.live https://www.googletagmanager.com https://www.google-analytics.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.clarity.ms https://connect.facebook.net https://snap.licdn.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https:",
          "font-src 'self' data:",
          "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://www.googletagmanager.com https://www.google.com https://stats.g.doubleclick.net https://ad.doubleclick.net https://googleads.g.doubleclick.net https://www.googleadservices.com https://www.clarity.ms https://*.neon.tech https://*.blob.vercel-storage.com https://*.public.blob.vercel-storage.com",
          "frame-src 'self' https://www.google.com https://maps.google.com https://www.googletagmanager.com https://td.doubleclick.net https://googleads.g.doubleclick.net",
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
