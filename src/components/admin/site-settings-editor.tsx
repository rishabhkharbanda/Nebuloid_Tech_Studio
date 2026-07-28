'use client'

import { useEffect, useState } from 'react'
import type { PublicSiteSettings } from '@/lib/cms/site-settings'

export function SiteSettingsEditor() {
  const [form, setForm] = useState({
    whatsappEnabled: false,
    whatsappLink: '',
    whatsappPhone: '',
    whatsappMessage: 'Hello! I would like to know more about Nebuloid Tech Studio.',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [preview, setPreview] = useState<PublicSiteSettings | null>(null)

  useEffect(() => {
    fetch('/api/admin/site-settings')
      .then((res) => res.json())
      .then((data) => {
        setForm({
          whatsappEnabled: Boolean(data.whatsappEnabled),
          whatsappLink: data.whatsappLink ?? '',
          whatsappPhone: data.whatsappPhone ?? '',
          whatsappMessage:
            data.whatsappMessage ??
            'Hello! I would like to know more about Nebuloid Tech Studio.',
        })
        setPreview(data)
      })
      .finally(() => setLoading(false))
  }, [])

  async function save(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Save failed')
      setPreview(data)
      setMessage('Settings saved. Changes appear on the live site within about a minute.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-[#6b7280]">Loading settings…</p>
  }

  return (
    <form onSubmit={save} className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#111827]">WhatsApp Button</h2>
        <p className="mt-1 text-sm text-[#6b7280]">
          Control the floating WhatsApp button shown on every public page.
        </p>
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3">
        <input
          type="checkbox"
          checked={form.whatsappEnabled}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, whatsappEnabled: event.target.checked }))
          }
          className="h-4 w-4"
        />
        <span className="text-sm font-medium text-[#111827]">Enable WhatsApp floating button</span>
      </label>

      <div>
        <label className="mb-2 block text-sm font-medium text-[#111827]">
          WhatsApp link (recommended)
        </label>
        <input
          type="url"
          value={form.whatsappLink}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, whatsappLink: event.target.value }))
          }
          placeholder="https://wa.me/message/L72JRPHENDZIJ1"
          className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#b45309]"
        />
        <p className="mt-2 text-xs text-[#6b7280]">
          Paste your WhatsApp Business click-to-chat link (e.g.{' '}
          <code className="rounded bg-black/5 px-1">https://wa.me/message/…</code>). This is used
          first when set.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-black/15 px-4 py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
          Fallback (only if link is empty)
        </p>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#111827]">
              WhatsApp phone number
            </label>
            <input
              type="text"
              value={form.whatsappPhone}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, whatsappPhone: event.target.value }))
              }
              placeholder="917303922260"
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#b45309]"
            />
            <p className="mt-2 text-xs text-[#6b7280]">
              Country code + number, digits only (no + or spaces required).
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#111827]">Default message</label>
            <textarea
              rows={3}
              value={form.whatsappMessage}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, whatsappMessage: event.target.value }))
              }
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#b45309]"
            />
          </div>
        </div>
      </div>

      {preview?.whatsappHref ? (
        <p className="rounded-xl bg-[#f4f5f7] px-4 py-3 text-xs text-[#374151]">
          Preview link:{' '}
          <a href={preview.whatsappHref} className="text-[#b45309] underline" target="_blank" rel="noreferrer">
            {preview.whatsappHref}
          </a>
        </p>
      ) : null}

      {message ? (
        <p className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-[#374151]">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save settings'}
      </button>
    </form>
  )
}
