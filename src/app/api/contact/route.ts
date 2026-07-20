import { NextResponse } from 'next/server'
import { Resend } from 'resend'
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

type ContactInquiry = {
  name: string
  email: string
  company: string | null
  eventType: string
  industry: string | null
  budget: string | null
  timeline: string | null
  message: string
  receivedAt: string
  destination: string
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function buildEmailText(inquiry: ContactInquiry) {
  return [
    'New contact form submission from nebuloidtechstudio.com',
    '',
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Organization: ${inquiry.company || '—'}`,
    `Event Type: ${inquiry.eventType}`,
    `Industry: ${inquiry.industry || '—'}`,
    `Budget: ${inquiry.budget || '—'}`,
    `Timeline: ${inquiry.timeline || '—'}`,
    `Received: ${inquiry.receivedAt}`,
    '',
    'Message:',
    inquiry.message,
  ].join('\n')
}

function buildEmailHtml(inquiry: ContactInquiry) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:8px 12px;color:#666;width:140px;">${label}</td><td style="padding:8px 12px;color:#111;">${escapeHtml(value || '—')}</td></tr>`

  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;">
      <h2 style="color:#181712;">New Nebuloid inquiry</h2>
      <table style="border-collapse:collapse;width:100%;border:1px solid #eee;">
        ${row('Name', inquiry.name)}
        ${row('Email', inquiry.email)}
        ${row('Organization', inquiry.company || '—')}
        ${row('Event Type', inquiry.eventType)}
        ${row('Industry', inquiry.industry || '—')}
        ${row('Budget', inquiry.budget || '—')}
        ${row('Timeline', inquiry.timeline || '—')}
        ${row('Received', inquiry.receivedAt)}
      </table>
      <p style="margin-top:20px;color:#666;">Message</p>
      <p style="white-space:pre-wrap;color:#111;line-height:1.5;">${escapeHtml(inquiry.message)}</p>
    </div>
  `
}

async function sendInquiryEmail(inquiry: ContactInquiry) {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) return false

  const resend = new Resend(apiKey)
  const from =
    process.env.CONTACT_FROM_EMAIL?.trim() || 'Nebuloid Contact <onboarding@resend.dev>'

  const { error } = await resend.emails.send({
    from,
    to: [inquiry.destination],
    replyTo: inquiry.email,
    subject: `New Nebuloid inquiry — ${inquiry.name}`,
    text: buildEmailText(inquiry),
    html: buildEmailHtml(inquiry),
  })

  if (error) {
    throw new Error(error.message || 'Failed to send contact email')
  }

  return true
}

async function appendInquiryToSheet(inquiry: ContactInquiry, skipEmail: boolean) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim()

  if (!webhookUrl) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[contact] GOOGLE_SHEETS_WEBHOOK_URL not set — logging locally', inquiry)
      return
    }

    throw new Error('GOOGLE_SHEETS_WEBHOOK_URL is not configured')
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...inquiry, skipEmail }),
    // Apps Script web apps can be slow on cold start.
    signal: AbortSignal.timeout(15000),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`Sheet webhook failed (${response.status}): ${detail.slice(0, 200)}`)
  }

  // Apps Script may return text/plain JSON — tolerate empty/non-JSON bodies.
  const raw = await response.text().catch(() => '')
  if (!raw) return

  try {
    const parsed = JSON.parse(raw) as { ok?: boolean; error?: string }
    if (parsed.ok === false) {
      throw new Error(parsed.error || 'Sheet webhook rejected the submission')
    }
  } catch (error) {
    if (error instanceof SyntaxError) return
    throw error
  }
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

    const inquiry: ContactInquiry = {
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

    let emailedViaResend = false
    try {
      emailedViaResend = await sendInquiryEmail(inquiry)
    } catch (error) {
      console.error('[contact] Resend email failed', error)
      // Fall through — Apps Script can still email via the sheet webhook.
    }

    await appendInquiryToSheet(inquiry, emailedViaResend)

    return NextResponse.json({
      ok: true,
      message: 'Thank you. Nebuloid will respond within one business day.',
    })
  } catch (error) {
    console.error('[contact] submission failed', error)
    return NextResponse.json(
      { ok: false, error: 'Unable to submit right now. Please try again.' },
      { status: 500 },
    )
  }
}
