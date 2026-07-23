'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/cms/seo-analyzer'

type Props = { cardId?: string }

const empty = {
  title: '',
  slug: '',
  shortDescription: '',
  imageUrl: '',
  imageAlt: '',
  iconUrl: '',
  ctaText: 'View Case Study',
  ctaHref: '',
  category: '',
  clientLabel: '',
  displayOrder: 0,
  enabled: true,
}

export function DigitalCardEditor({ cardId }: Props) {
  const router = useRouter()
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(Boolean(cardId))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!cardId) return
    let cancelled = false
    ;(async () => {
      const response = await fetch(`/api/admin/digital-experiences/${cardId}`)
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Failed to load card')
        setLoading(false)
        return
      }
      if (cancelled) return
      setForm({
        title: data.card.title,
        slug: data.card.slug,
        shortDescription: data.card.shortDescription,
        imageUrl: data.card.imageUrl,
        imageAlt: data.card.imageAlt,
        iconUrl: data.card.iconUrl,
        ctaText: data.card.ctaText,
        ctaHref: data.card.ctaHref,
        category: data.card.category,
        clientLabel: data.card.clientLabel,
        displayOrder: data.card.displayOrder,
        enabled: data.card.enabled,
      })
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [cardId])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
    }
    const response = await fetch(
      cardId ? `/api/admin/digital-experiences/${cardId}` : '/api/admin/digital-experiences',
      {
        method: cardId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    )
    const data = await response.json()
    setSaving(false)
    if (!response.ok) {
      setError(data.error || 'Save failed')
      return
    }
    if (!cardId) {
      router.replace(`/admin/digital-experiences/${data.card.id}`)
      router.refresh()
    }
  }

  async function remove() {
    if (!cardId) return
    if (!confirm('Delete this card?')) return
    const response = await fetch(`/api/admin/digital-experiences/${cardId}`, { method: 'DELETE' })
    if (response.ok) {
      router.replace('/admin/digital-experiences')
      router.refresh()
    }
  }

  if (loading) return <p className="text-sm text-[#6b7280]">Loading card…</p>

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-4 rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">
          {cardId ? 'Edit experience card' : 'New experience card'}
        </h2>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#111827] px-3 py-2 text-sm text-white disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          {cardId ? (
            <button
              type="button"
              onClick={remove}
              className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-700"
            >
              Delete
            </button>
          ) : null}
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <label className="block text-sm font-medium">
        Title
        <input
          required
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              title: e.target.value,
              slug: prev.slug || slugify(e.target.value),
            }))
          }
          className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium">
          Slug
          <input
            value={form.slug}
            onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
            className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </label>
        <label className="block text-sm font-medium">
          Display order
          <input
            type="number"
            value={form.displayOrder}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, displayOrder: Number(e.target.value) || 0 }))
            }
            className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </label>
      </div>

      <label className="block text-sm font-medium">
        Short description
        <textarea
          rows={4}
          value={form.shortDescription}
          onChange={(e) => setForm((prev) => ({ ...prev, shortDescription: e.target.value }))}
          className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium">
          Image URL
          <input
            value={form.imageUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </label>
        <label className="block text-sm font-medium">
          Image alt
          <input
            value={form.imageAlt}
            onChange={(e) => setForm((prev) => ({ ...prev, imageAlt: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </label>
      </div>

      <label className="block text-sm font-medium">
        Icon URL (optional)
        <input
          value={form.iconUrl}
          onChange={(e) => setForm((prev) => ({ ...prev, iconUrl: e.target.value }))}
          className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium">
          CTA button text
          <input
            value={form.ctaText}
            onChange={(e) => setForm((prev) => ({ ...prev, ctaText: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </label>
        <label className="block text-sm font-medium">
          CTA link
          <input
            value={form.ctaHref}
            onChange={(e) => setForm((prev) => ({ ...prev, ctaHref: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
            placeholder="/digital-experiences/slug"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium">
          Category
          <input
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </label>
        <label className="block text-sm font-medium">
          Client label
          <input
            value={form.clientLabel}
            onChange={(e) => setForm((prev) => ({ ...prev, clientLabel: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </label>
      </div>

      <label className="inline-flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={form.enabled}
          onChange={(e) => setForm((prev) => ({ ...prev, enabled: e.target.checked }))}
        />
        Visible on website
      </label>
    </form>
  )
}
