'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || 'G-BYJ6D14KLM'
const GOOGLE_ADS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim() || 'AW-18308378295'
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim()
const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || '1583262146501649'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
    fbq?: (...args: unknown[]) => void
  }
}

/**
 * Fires GA4 + Meta Pixel page views on App Router client navigations.
 * Initial page views are handled by the bootstrap scripts.
 */
export function AnalyticsRouteListener() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const pagePath = `${pathname}${searchParams?.toString() ? `?${searchParams}` : ''}`

    // When GTM owns tags, rely on its History Change / pageview triggers.
    if (!GTM_ID && GA_MEASUREMENT_ID && typeof window.gtag === 'function') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        send_page_view: true,
        page_path: pagePath,
        page_location: window.location.href,
        page_title: document.title,
      })
      if (GOOGLE_ADS_ID) {
        window.gtag('event', 'page_view', {
          send_to: GOOGLE_ADS_ID,
          page_path: pagePath,
        })
      }
    }

    if (META_PIXEL_ID && typeof window.fbq === 'function') {
      window.fbq('track', 'PageView')
    }
  }, [pathname, searchParams])

  return null
}
