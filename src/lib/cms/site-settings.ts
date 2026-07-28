import { eq } from 'drizzle-orm'
import { getDb, hasDatabase } from '@/db/client'
import { siteSettings, type SiteSettings } from '@/db/schema'

export const SITE_SETTINGS_ID = 'default'

export type PublicSiteSettings = {
  whatsappEnabled: boolean
  whatsappLink: string
  whatsappPhone: string
  whatsappMessage: string
  whatsappHref: string
}

const DEFAULTS: PublicSiteSettings = {
  whatsappEnabled: false,
  whatsappLink: '',
  whatsappPhone: '',
  whatsappMessage: 'Hello! I would like to know more about Nebuloid Tech Studio.',
  whatsappHref: '',
}

/** Accept wa.me / api.whatsapp.com click-to-chat URLs only. */
export function normalizeWhatsAppLink(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  try {
    const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`)
    const host = url.hostname.replace(/^www\./, '').toLowerCase()
    if (host !== 'wa.me' && host !== 'api.whatsapp.com') return ''
    return url.toString()
  } catch {
    return ''
  }
}

function buildWhatsAppHrefFromPhone(phone: string, message: string) {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return ''
  const text = encodeURIComponent(message.trim() || DEFAULTS.whatsappMessage)
  return `https://wa.me/${digits}?text=${text}`
}

function resolveWhatsAppHref(link: string, phone: string, message: string) {
  const fromLink = normalizeWhatsAppLink(link)
  if (fromLink) return fromLink
  return buildWhatsAppHrefFromPhone(phone, message)
}

export function mapSiteSettings(row: SiteSettings | null | undefined): PublicSiteSettings {
  if (!row) return DEFAULTS
  const link = (row.whatsappLink ?? '').trim()
  const phone = row.whatsappPhone.trim()
  const message = row.whatsappMessage.trim() || DEFAULTS.whatsappMessage
  return {
    whatsappEnabled: row.whatsappEnabled,
    whatsappLink: link,
    whatsappPhone: phone,
    whatsappMessage: message,
    whatsappHref: resolveWhatsAppHref(link, phone, message),
  }
}

export async function getSiteSettings(): Promise<PublicSiteSettings> {
  if (!hasDatabase()) return DEFAULTS
  try {
    const db = getDb()
    const [row] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.id, SITE_SETTINGS_ID))
      .limit(1)
    return mapSiteSettings(row)
  } catch {
    return DEFAULTS
  }
}

export async function upsertSiteSettings(input: {
  whatsappEnabled: boolean
  whatsappLink: string
  whatsappPhone: string
  whatsappMessage: string
}) {
  const db = getDb()
  const normalizedLink = normalizeWhatsAppLink(input.whatsappLink)
  if (input.whatsappLink.trim() && !normalizedLink) {
    throw new Error('WhatsApp link must be a wa.me or api.whatsapp.com URL.')
  }

  const payload = {
    id: SITE_SETTINGS_ID,
    whatsappEnabled: input.whatsappEnabled,
    whatsappLink: normalizedLink,
    whatsappPhone: input.whatsappPhone.trim(),
    whatsappMessage: input.whatsappMessage.trim() || DEFAULTS.whatsappMessage,
    updatedAt: new Date(),
  }
  const [row] = await db
    .insert(siteSettings)
    .values(payload)
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: {
        whatsappEnabled: payload.whatsappEnabled,
        whatsappLink: payload.whatsappLink,
        whatsappPhone: payload.whatsappPhone,
        whatsappMessage: payload.whatsappMessage,
        updatedAt: payload.updatedAt,
      },
    })
    .returning()
  return mapSiteSettings(row)
}
