'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SeoScorePanel } from '@/components/admin/seo-score-panel'
import { analyzeBlogSeo, slugify, type SeoAnalysis } from '@/lib/cms/seo-analyzer'

type Props = { serviceId?: string }

const empty = {
  title: '',
  slug: '',
  description: '',
  detail: '',
  tagsText: '',
  imageUrl: '',
  imageAlt: '',
  intro: '',
  sectionsText: '',
  highlightsText: '',
  displayLabel: '',
  displayOrder: 0,
  enabled: true,
  status: 'draft' as 'draft' | 'published' | 'unpublished',
  metaTitle: '',
  metaDescription: '',
  focusKeyword: '',
  canonicalPath: '',
  ogImageUrl: '',
  twitterImageUrl: '',
  robotsIndex: true,
  schemaType: 'Service',
}

function lines(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function parseSections(text: string) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title = '', content = ''] = line.split('|').map((part) => part.trim())
      return { title, content }
    })
    .filter((item) => item.title && item.content)
}

export function ExperienceServiceEditor({ serviceId }: Props) {
  const router = useRouter()
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(Boolean(serviceId))
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [seo, setSeo] = useState<SeoAnalysis | null>(null)

  useEffect(() => {
    if (!serviceId) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/admin/experiences/${serviceId}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to load')
        if (cancelled) return
        const service = data.service
        setForm({
          title: service.title || '',
          slug: service.slug || '',
          description: service.description || '',
          detail: service.detail || '',
          tagsText: (service.tags || []).join('\n'),
          imageUrl: service.imageUrl || '',
          imageAlt: service.imageAlt || '',
          intro: service.intro || '',
          sectionsText: (service.sections || [])
            .map((section: { title: string; content: string }) =>
              `${section.title} | ${section.content}`,
            )
            .join('\n'),
          highlightsText: (service.highlights || []).join('\n'),
          displayLabel: service.displayLabel || '',
          displayOrder: service.displayOrder ?? 0,
          enabled: service.enabled !== false,
          status: service.status || 'draft',
          metaTitle: service.metaTitle || '',
          metaDescription: service.metaDescription || '',
          focusKeyword: service.focusKeyword || '',
          canonicalPath: service.canonicalPath || '',
          ogImageUrl: service.ogImageUrl || '',
          twitterImageUrl: service.twitterImageUrl || '',
          robotsIndex: service.robotsIndex !== false,
          schemaType: service.schemaType || 'Service',
        })
        setSeo(data.seo || null)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [serviceId])

  const liveSeo = useMemo(
    () =>
      analyzeBlogSeo({
        title: form.title,
        slug: form.slug || slugify(form.title),
        excerpt: form.metaDescription || form.description,
        body: [form.intro, form.detail, form.highlightsText, form.sectionsText].join('\n'),
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        focusKeyword: form.focusKeyword,
        featuredImageUrl: form.imageUrl || form.ogImageUrl,
        featuredImageAlt: form.imageAlt || form.title,
        canonicalPath: form.canonicalPath || `/experiences/${form.slug || slugify(form.title)}`,
        ogImageUrl: form.ogImageUrl || form.imageUrl,
        robotsIndex: form.robotsIndex,
      }),
    [form],
  )

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const slug = form.slug || slugify(form.title)
      const payload = {
        title: form.title,
        slug,
        description: form.description,
        detail: form.detail,
        tags: lines(form.tagsText),
        imageUrl: form.imageUrl,
        imageAlt: form.imageAlt || form.title,
        intro: form.intro,
        sections: parseSections(form.sectionsText),
        highlights: lines(form.highlightsText),
        displayLabel: form.displayLabel,
        displayOrder: form.displayOrder,
        enabled: form.enabled,
        status: form.status,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        focusKeyword: form.focusKeyword,
        canonicalPath: form.canonicalPath || `/experiences/${slug}`,
        ogImageUrl: form.ogImageUrl || form.imageUrl,
        twitterImageUrl: form.twitterImageUrl || form.ogImageUrl || form.imageUrl,
        robotsIndex: form.robotsIndex,
        schemaType: form.schemaType,
      }
      const res = await fetch(
        serviceId ? `/api/admin/experiences/${serviceId}` : '/api/admin/experiences',
        {
          method: serviceId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      setSeo(data.seo || null)
      if (!serviceId && data.service?.id) {
        router.replace(`/admin/experiences/${data.service.id}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function onDelete() {
    if (!serviceId) return
    if (!window.confirm('Delete this experience? This cannot be undone.')) return
    setDeleting(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/experiences/${serviceId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Delete failed')
      router.replace('/admin/experiences')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <p className="text-sm text-[#6b7280]">Loading…</p>

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <Field label="Title">
          <input
            required
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="URL slug">
            <input
              value={form.slug}
              onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder={slugify(form.title) || 'experience-slug'}
              className="w-full rounded-xl border border-black/10 px-3 py-2.5"
            />
          </Field>
          <Field label="Display label (e.g. 01)">
            <input
              value={form.displayLabel}
              onChange={(e) => setForm((prev) => ({ ...prev, displayLabel: e.target.value }))}
              placeholder="Auto from order"
              className="w-full rounded-xl border border-black/10 px-3 py-2.5"
            />
          </Field>
        </div>
        <Field label="Short description (homepage & listing)">
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </Field>
        <Field label="Extended detail (homepage cards)">
          <textarea
            rows={3}
            value={form.detail}
            onChange={(e) => setForm((prev) => ({ ...prev, detail: e.target.value }))}
            className="w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </Field>
        <Field label="Tags (one per line)">
          <textarea
            rows={4}
            value={form.tagsText}
            onChange={(e) => setForm((prev) => ({ ...prev, tagsText: e.target.value }))}
            className="w-full rounded-xl border border-black/10 px-3 py-2.5 font-mono text-sm"
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Image URL">
            <input
              value={form.imageUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
              className="w-full rounded-xl border border-black/10 px-3 py-2.5"
            />
          </Field>
          <Field label="Image alt text">
            <input
              value={form.imageAlt}
              onChange={(e) => setForm((prev) => ({ ...prev, imageAlt: e.target.value }))}
              className="w-full rounded-xl border border-black/10 px-3 py-2.5"
            />
          </Field>
        </div>
        <Field label="Detail page intro">
          <textarea
            rows={3}
            value={form.intro}
            onChange={(e) => setForm((prev) => ({ ...prev, intro: e.target.value }))}
            className="w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </Field>
        <Field label="Detail sections (Title | Content — one per line)">
          <textarea
            rows={6}
            value={form.sectionsText}
            onChange={(e) => setForm((prev) => ({ ...prev, sectionsText: e.target.value }))}
            className="w-full rounded-xl border border-black/10 px-3 py-2.5 font-mono text-sm"
          />
        </Field>
        <Field label="Highlights (one per line)">
          <textarea
            rows={5}
            value={form.highlightsText}
            onChange={(e) => setForm((prev) => ({ ...prev, highlightsText: e.target.value }))}
            className="w-full rounded-xl border border-black/10 px-3 py-2.5 font-mono text-sm"
          />
        </Field>

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status: e.target.value as 'draft' | 'published' | 'unpublished',
                }))
              }
              className="w-full rounded-xl border border-black/10 px-3 py-2.5"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
          </Field>
          <Field label="Display order">
            <input
              type="number"
              min={0}
              value={form.displayOrder}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, displayOrder: Number(e.target.value) || 0 }))
              }
              className="w-full rounded-xl border border-black/10 px-3 py-2.5"
            />
          </Field>
          <Field label="Visibility">
            <label className="mt-2 flex items-center gap-2 text-sm font-normal">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => setForm((prev) => ({ ...prev, enabled: e.target.checked }))}
              />
              Show on site when published
            </label>
          </Field>
        </div>

        <details className="rounded-2xl border border-black/10 p-4">
          <summary className="cursor-pointer text-sm font-medium">SEO metadata</summary>
          <div className="mt-4 space-y-4">
            <Field label="Meta title">
              <input
                value={form.metaTitle}
                onChange={(e) => setForm((prev) => ({ ...prev, metaTitle: e.target.value }))}
                className="w-full rounded-xl border border-black/10 px-3 py-2.5"
              />
            </Field>
            <Field label="Meta description">
              <textarea
                rows={3}
                value={form.metaDescription}
                onChange={(e) => setForm((prev) => ({ ...prev, metaDescription: e.target.value }))}
                className="w-full rounded-xl border border-black/10 px-3 py-2.5"
              />
            </Field>
            <Field label="Focus keyword">
              <input
                value={form.focusKeyword}
                onChange={(e) => setForm((prev) => ({ ...prev, focusKeyword: e.target.value }))}
                className="w-full rounded-xl border border-black/10 px-3 py-2.5"
              />
            </Field>
            <Field label="Canonical path">
              <input
                value={form.canonicalPath}
                onChange={(e) => setForm((prev) => ({ ...prev, canonicalPath: e.target.value }))}
                placeholder={`/experiences/${form.slug || slugify(form.title)}`}
                className="w-full rounded-xl border border-black/10 px-3 py-2.5"
              />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.robotsIndex}
                onChange={(e) => setForm((prev) => ({ ...prev, robotsIndex: e.target.checked }))}
              />
              Allow search indexing
            </label>
          </div>
        </details>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          {serviceId ? (
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
      </div>

      <SeoScorePanel
        analysis={seo || liveSeo}
        preview={{
          title: form.metaTitle || form.title,
          description: form.metaDescription || form.description,
          slug: form.slug || slugify(form.title),
          imageUrl: form.ogImageUrl || form.imageUrl,
        }}
      />
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium">
      <span className="mb-2 block">{label}</span>
      {children}
    </label>
  )
}
