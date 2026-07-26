import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
    return [
      {
        source: '/gone',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ]
  },
}

export default nextConfig
