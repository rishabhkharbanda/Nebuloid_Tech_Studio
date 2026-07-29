'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { defaultHeroDescription } from '@/lib/site-data'

type Props = { slideId?: string }

const OVERLAY_PRESETS = [
  {
    label: 'Violet / AI',
    value:
      'from-[#161022]/60 via-[#2f1b4d]/45 to-[#090909]/70 before:bg-[radial-gradient(circle_at_50%_20%,rgba(112,192,255,.14),transparent_50%)]',
  },
  {
    label: 'Cool blue',
    value:
      'from-[#0e0f13]/60 via-[#1f2538]/45 to-[#090909]/70 before:bg-[radial-gradient(circle_at_70%_35%,rgba(129,175,255,.12),transparent_45%)]',
  },
  {
    label: 'Warm amber',
    value:
      'from-[#131111]/60 via-[#37220f]/45 to-[#090909]/70 before:bg-[radial-gradient(circle_at_55%_20%,rgba(255,164,72,.16),transparent_52%)]',
  },
  {
    label: 'Deep indigo',
    value:
      'from-[#0b1024]/60 via-[#0f1438]/45 to-[#090909]/70 before:bg-[radial-gradient(circle_at_25%_40%,rgba(108,124,255,.14),transparent_45%)]',
  },
  {
    label: 'Gold',
    value:
      'from-[#0f1116]/60 via-[#1f2335]/45 to-[#090909]/70 before:bg-[radial-gradient(circle_at_32%_30%,rgba(212,175,55,.14),transparent_45%)]',
  },
  {
    label: 'Magenta',
    value:
      'from-[#161022]/60 via-[#2f1b4d]/45 to-[#090909]/70 before:bg-[radial-gradient(circle_at_50%_20%,rgba(229,112,255,.12),transparent_50%)]',
  },
]

const empty = {
  title: '',
  description: defaultHeroDescription,
  imageUrl: '',
  imageAlt: '',
  overlayClasses: OVERLAY_PRESETS[0].value,
  displayOrder: 0,
  enabled: true,
  status: 'published' as 'draft' | 'published' | 'unpublished',
}

export function HeroSlideEditor({ slideId }: Props) {
  const router = useRouter()
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(Boolean(slideId))
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slideId) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/admin/hero-slides/${slideId}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to load')
        if (cancelled) return
        const slide = data.slide
        setForm({
          title: slide.title || '',
          description: slide.description || defaultHeroDescription,
          imageUrl: slide.imageUrl || '',
          imageAlt: slide.imageAlt || '',
          overlayClasses: slide.overlayClasses || OVERLAY_PRESETS[0].value,
          displayOrder: slide.displayOrder ?? 0,
          enabled: slide.enabled !== false,
          status: slide.status || 'published',
        })
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slideId])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        title: form.title,
        description: form.description,
        imageUrl: form.imageUrl,
        imageAlt: form.imageAlt || form.title,
        overlayClasses: form.overlayClasses,
        displayOrder: form.displayOrder,
        enabled: form.enabled,
        status: form.status,
      }
      const res = await fetch(
        slideId ? `/api/admin/hero-slides/${slideId}` : '/api/admin/hero-slides',
        {
          method: slideId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      router.push('/admin/hero-slides')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function onDelete() {
    if (!slideId) return
    if (!window.confirm('Delete this hero banner? This cannot be undone.')) return
    setDeleting(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/hero-slides/${slideId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Delete failed')
      router.push('/admin/hero-slides')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-[#6b7280]">Loading slide…</p>
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium">Headline title</span>
          <input
            required
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="AI Experiences."
            className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
          />
          <span className="text-xs text-[#6b7280]">
            Rotating line under “We Create” on the homepage hero.
          </span>
        </label>

        <label className="block space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium">Supporting text</span>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
          />
          <span className="text-xs text-[#6b7280]">
            Shown below the headline for this slide. Leave blank to use the site default.
          </span>
        </label>

        <label className="block space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium">Banner image URL</span>
          <input
            required
            value={form.imageUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
            placeholder="/assets/hero/... or Media Library URL"
            className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
          />
          <span className="text-xs text-[#6b7280]">
            Upload in Media Library (folder: hero), then paste the copied URL here.
          </span>
        </label>

        {form.imageUrl ? (
          <div className="md:col-span-2 overflow-hidden rounded-2xl border border-black/10 bg-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.imageUrl}
              alt={form.imageAlt || form.title || 'Banner preview'}
              className="h-48 w-full object-cover"
            />
          </div>
        ) : null}

        <label className="block space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium">Image alt text</span>
          <input
            value={form.imageAlt}
            onChange={(e) => setForm((prev) => ({ ...prev, imageAlt: e.target.value }))}
            className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
          />
        </label>

        <label className="block space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium">Overlay preset</span>
          <select
            value={
              OVERLAY_PRESETS.some((preset) => preset.value === form.overlayClasses)
                ? form.overlayClasses
                : '__custom__'
            }
            onChange={(e) => {
              if (e.target.value === '__custom__') return
              setForm((prev) => ({ ...prev, overlayClasses: e.target.value }))
            }}
            className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
          >
            {OVERLAY_PRESETS.map((preset) => (
              <option key={preset.label} value={preset.value}>
                {preset.label}
              </option>
            ))}
            <option value="__custom__">Custom (edit field below)</option>
          </select>
        </label>

        <label className="block space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium">Overlay classes</span>
          <textarea
            rows={3}
            value={form.overlayClasses}
            onChange={(e) => setForm((prev) => ({ ...prev, overlayClasses: e.target.value }))}
            className="w-full rounded-xl border border-black/10 px-3 py-2.5 font-mono text-xs"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Display order</span>
          <input
            type="number"
            min={0}
            value={form.displayOrder}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, displayOrder: Number(e.target.value) || 0 }))
            }
            className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Status</span>
          <select
            value={form.status}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                status: e.target.value as 'draft' | 'published' | 'unpublished',
              }))
            }
            className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="unpublished">Unpublished</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(e) => setForm((prev) => ({ ...prev, enabled: e.target.checked }))}
          />
          Show on homepage when published
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? 'Saving…' : slideId ? 'Save changes' : 'Create slide'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/hero-slides')}
          className="rounded-xl border border-black/10 px-4 py-2.5 text-sm font-medium"
        >
          Cancel
        </button>
        {slideId ? (
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700 disabled:opacity-60"
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        ) : null}
      </div>
    </form>
  )
}
