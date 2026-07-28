import { eq } from 'drizzle-orm'
import { getDb, hasDatabase } from '@/db/client'
import { siteSettings, type SiteSettings } from '@/db/schema'

export const SITE_SETTINGS_ID = 'default'

export type PublicSiteSettings = {
  whatsappEnabled: boolean
  whatsappPhone: string
  whatsappMessage: string
  whatsappHref: string
}

const DEFAULTS: PublicSiteSettings = {
  whatsappEnabled: false,
  whatsappPhone: '',
  whatsappMessage: 'Hello! I would like to know more about Nebuloid Tech Studio.',
  whatsappHref: '',
}

function buildWhatsAppHref(phone: string, message: string) {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return ''
  const text = encodeURIComponent(message.trim() || DEFAULTS.whatsappMessage)
  return `https://wa.me/${digits}?text=${text}`
}

export function mapSiteSettings(row: SiteSettings | null | undefined): PublicSiteSettings {
  if (!row) return DEFAULTS
  const phone = row.whatsappPhone.trim()
  const message = row.whatsappMessage.trim() || DEFAULTS.whatsappMessage
  return {
    whatsappEnabled: row.whatsappEnabled,
    whatsappPhone: phone,
    whatsappMessage: message,
    whatsappHref: buildWhatsAppHref(phone, message),
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
  whatsappPhone: string
  whatsappMessage: string
}) {
  const db = getDb()
  const payload = {
    id: SITE_SETTINGS_ID,
    whatsappEnabled: input.whatsappEnabled,
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
        whatsappPhone: payload.whatsappPhone,
        whatsappMessage: payload.whatsappMessage,
        updatedAt: payload.updatedAt,
      },
    })
    .returning()
  return mapSiteSettings(row)
}
