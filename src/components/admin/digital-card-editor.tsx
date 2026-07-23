'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/cms/seo-analyzer'

type Props = { cardId?: string }

type GalleryDraft = { src: string; alt: string; label: string }

const empty = {
  title: '',
  slug: '',
  shortDescription: '',
  overview: '',
  subtitle: '',
  imageUrl: '',
  imageAlt: '',
  iconUrl: '',
  ctaText: 'View Case Study',
  ctaHref: '',
  category: '',
  clientLabel: '',
  displayOrder: 0,
  enabled: true,
  status: 'draft' as 'draft' | 'published' | 'unpublished',
  galleryTitle: '',
  galleryHeading: '',
  galleryAspect: '' as '' | 'wide' | 'video',
  galleryText: '',
  contributionText: '',
  aiBoothText: '',
  gamesText: '',
  technologiesText: '',
  techStackText: '',
  impactText: '',
  metaTitle: '',
  metaDescription: '',
  previewToken: '',
}

function linesToList(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function listToLines(value: string[] | null | undefined) {
  return (value ?? []).join('\n')
}

function parseGallery(text: string): GalleryDraft[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [src = '', alt = '', label = ''] = line.split('|').map((part) => part.trim())
      return { src, alt, label }
    })
    .filter((item) => item.src)
}

function galleryToText(items: GalleryDraft[] | null | undefined) {
  return (items ?? []).map((item) => `${item.src} | ${item.alt} | ${item.label}`).join('\n')
}

export function DigitalCardEditor({ cardId }: Props) {
  const router = useRouter()
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(Boolean(cardId))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')

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
      const card = data.card
      const interactive = card.interactiveExperiences || {}
      setForm({
        title: card.title,
        slug: card.slug,
        shortDescription: card.shortDescription,
        overview: card.overview || card.shortDescription,
        subtitle: card.subtitle || '',
        imageUrl: card.imageUrl,
        imageAlt: card.imageAlt,
        iconUrl: card.iconUrl,
        ctaText: card.ctaText,
        ctaHref: card.ctaHref,
        category: card.category,
        clientLabel: card.clientLabel,
        displayOrder: card.displayOrder,
        enabled: card.enabled,
        status: card.status || 'draft',
        galleryTitle: card.galleryTitle || '',
        galleryHeading: card.galleryHeading || '',
        galleryAspect: card.galleryAspect === 'wide' || card.galleryAspect === 'video' ? card.galleryAspect : '',
        galleryText: galleryToText(card.gallery),
        contributionText: listToLines(card.contribution),
        aiBoothText: listToLines(interactive.aiBooth),
        gamesText: listToLines(interactive.games),
        technologiesText: listToLines(interactive.technologies),
        techStackText: listToLines(card.techStack),
        impactText: listToLines(card.impact),
        metaTitle: card.metaTitle || '',
        metaDescription: card.metaDescription || '',
        previewToken: card.previewToken || '',
      })
      if (card.slug && card.previewToken) {
        setPreviewUrl(`/preview/digital-experiences/${card.slug}?token=${card.previewToken}`)
      }
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [cardId])

  function buildPayload(status?: typeof form.status) {
    const slug = form.slug || slugify(form.title)
    return {
      title: form.title,
      slug,
      shortDescription: form.shortDescription || form.overview,
      overview: form.overview || form.shortDescription,
      subtitle: form.subtitle,
      imageUrl: form.imageUrl,
      imageAlt: form.imageAlt,
      iconUrl: form.iconUrl,
      ctaText: form.ctaText,
      ctaHref: form.ctaHref || `/digital-experiences/${slug}`,
      category: form.category,
      clientLabel: form.clientLabel,
      displayOrder: form.displayOrder,
      enabled: form.enabled,
      status: status ?? form.status,
      galleryTitle: form.galleryTitle,
      galleryHeading: form.galleryHeading,
      galleryAspect: form.galleryAspect || null,
      gallery: parseGallery(form.galleryText),
      contribution: linesToList(form.contributionText),
      interactiveExperiences: {
        aiBooth: linesToList(form.aiBoothText),
        games: linesToList(form.gamesText),
        technologies: linesToList(form.technologiesText),
      },
      techStack: linesToList(form.techStackText),
      impact: linesToList(form.impactText),
      metaTitle: form.metaTitle,
      metaDescription: form.metaDescription,
    }
  }

  async function save(status?: typeof form.status) {
    setSaving(true)
    setError('')
    const payload = buildPayload(status)
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
    if (data.card?.previewToken && data.card?.slug) {
      setPreviewUrl(`/preview/digital-experiences/${data.card.slug}?token=${data.card.previewToken}`)
      setForm((prev) => ({
        ...prev,
        status: data.card.status,
        previewToken: data.card.previewToken,
        slug: data.card.slug,
      }))
    }
    if (!cardId) {
      router.replace(`/admin/digital-experiences/${data.card.id}`)
      router.refresh()
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    await save()
  }

  async function remove() {
    if (!cardId) return
    if (!confirm('Delete this experience? Only admins can delete.')) return
    const response = await fetch(`/api/admin/digital-experiences/${cardId}`, { method: 'DELETE' })
    const data = await response.json()
    if (!response.ok) {
      setError(data.error || 'Delete failed')
      return
    }
    router.replace('/admin/digital-experiences')
    router.refresh()
  }

  if (loading) return <p className="text-sm text-[#6b7280]">Loading experience…</p>

  return (
    <form onSubmit={onSubmit} className="max-w-4xl space-y-6 rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {cardId ? 'Edit digital experience' : 'New digital experience'}
          </h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            Listing card + full case-study content for the public detail page.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => save('draft')}
            className="rounded-xl border border-black/10 px-3 py-2 text-sm"
          >
            Save draft
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => save('published')}
            className="rounded-xl bg-[#111827] px-3 py-2 text-sm text-white"
          >
            Publish
          </button>
          {previewUrl ? (
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-[#d4af37]/40 px-3 py-2 text-sm text-[#92400e]"
            >
              Open preview
            </a>
          ) : null}
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

      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#6b7280]">Basics</h3>
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

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium">
            Status
            <select
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status: e.target.value as typeof form.status,
                }))
              }
              className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
          </label>
          <label className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(e) => setForm((prev) => ({ ...prev, enabled: e.target.checked }))}
            />
            Show in listings when published
          </label>
        </div>

        <label className="block text-sm font-medium">
          Subtitle (optional)
          <input
            value={form.subtitle}
            onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </label>

        <label className="block text-sm font-medium">
          Overview / short description
          <textarea
            rows={5}
            value={form.overview}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                overview: e.target.value,
                shortDescription: e.target.value,
              }))
            }
            className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </label>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
          Listing & media
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium">
            Hero image URL
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
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
          Case study detail
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium">
            Gallery title
            <input
              value={form.galleryTitle}
              onChange={(e) => setForm((prev) => ({ ...prev, galleryTitle: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
            />
          </label>
          <label className="block text-sm font-medium">
            Gallery aspect
            <select
              value={form.galleryAspect}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  galleryAspect: e.target.value as typeof form.galleryAspect,
                }))
              }
              className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
            >
              <option value="">Default</option>
              <option value="wide">Wide</option>
              <option value="video">Video</option>
            </select>
          </label>
        </div>
        <label className="block text-sm font-medium">
          Gallery heading
          <input
            value={form.galleryHeading}
            onChange={(e) => setForm((prev) => ({ ...prev, galleryHeading: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </label>
        <label className="block text-sm font-medium">
          Gallery items (one per line: src | alt | label)
          <textarea
            rows={6}
            value={form.galleryText}
            onChange={(e) => setForm((prev) => ({ ...prev, galleryText: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5 font-mono text-xs"
          />
        </label>
        <label className="block text-sm font-medium">
          Contribution (one per line)
          <textarea
            rows={5}
            value={form.contributionText}
            onChange={(e) => setForm((prev) => ({ ...prev, contributionText: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </label>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block text-sm font-medium">
            AI booth items
            <textarea
              rows={5}
              value={form.aiBoothText}
              onChange={(e) => setForm((prev) => ({ ...prev, aiBoothText: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
            />
          </label>
          <label className="block text-sm font-medium">
            Games
            <textarea
              rows={5}
              value={form.gamesText}
              onChange={(e) => setForm((prev) => ({ ...prev, gamesText: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
            />
          </label>
          <label className="block text-sm font-medium">
            Technologies
            <textarea
              rows={5}
              value={form.technologiesText}
              onChange={(e) => setForm((prev) => ({ ...prev, technologiesText: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
            />
          </label>
        </div>
        <label className="block text-sm font-medium">
          Tech stack (one per line)
          <textarea
            rows={4}
            value={form.techStackText}
            onChange={(e) => setForm((prev) => ({ ...prev, techStackText: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </label>
        <label className="block text-sm font-medium">
          Business impact (one per line)
          <textarea
            rows={4}
            value={form.impactText}
            onChange={(e) => setForm((prev) => ({ ...prev, impactText: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </label>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#6b7280]">SEO</h3>
        <label className="block text-sm font-medium">
          Meta title
          <input
            value={form.metaTitle}
            onChange={(e) => setForm((prev) => ({ ...prev, metaTitle: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </label>
        <label className="block text-sm font-medium">
          Meta description
          <textarea
            rows={3}
            value={form.metaDescription}
            onChange={(e) => setForm((prev) => ({ ...prev, metaDescription: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </label>
      </section>

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  )
}
