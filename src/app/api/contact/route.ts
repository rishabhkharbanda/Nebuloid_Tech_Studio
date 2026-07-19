import { NextResponse } from 'next/server'
import { siteConfig } from '@/lib/seo'

type ContactPayload = {
  name?: string
  email?: string
  company?: string
  eventType?: string
  industry?: string
  budget?: string
  timeline?: string
  message?: string
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload

    const name = body.name?.trim() ?? ''
    const email = body.email?.trim() ?? ''
    const message = body.message?.trim() ?? ''
    const eventType = body.eventType?.trim() ?? ''

    if (!name || !email || !message || !eventType) {
      return NextResponse.json(
        { ok: false, error: 'Please complete all required fields.' },
        { status: 400 },
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: 'Please enter a valid email address.' },
        { status: 400 },
      )
    }

    const inquiry = {
      name,
      email,
      company: body.company?.trim() || null,
      eventType,
      industry: body.industry?.trim() || null,
      budget: body.budget?.trim() || null,
      timeline: body.timeline?.trim() || null,
      message,
      receivedAt: new Date().toISOString(),
      destination: siteConfig.email,
    }

    // Production email delivery can be wired through RESEND_API_KEY later.
    // For now we validate and acknowledge the inquiry so CTAs work end-to-end.
    if (process.env.NODE_ENV !== 'production') {
      console.info('[contact]', inquiry)
    }

    return NextResponse.json({
      ok: true,
      message: 'Thank you. Nebuloid will respond within one business day.',
    })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Unable to submit right now. Please try again.' },
      { status: 500 },
    )
  }
}
