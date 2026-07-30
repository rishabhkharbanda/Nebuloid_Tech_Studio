'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || 'G-BYJ6D14KLM'
const GOOGLE_ADS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim() || 'AW-18308378295'
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim()

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

/**
 * Fires GA4 page_view on App Router client navigations.
 * Initial page_view is handled by the gtag('config') bootstrap.
 */
export function AnalyticsRouteListener() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // When GTM owns tags, rely on its History Change / pageview triggers.
    if (GTM_ID) return
    if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || typeof window.gtag !== 'function') {
      return
    }

    const pagePath = `${pathname}${searchParams?.toString() ? `?${searchParams}` : ''}`
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
  }, [pathname, searchParams])

  return null
}
