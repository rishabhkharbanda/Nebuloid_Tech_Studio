'use client'

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SeoScorePanel, TagInput } from '@/components/admin/seo-score-panel'
import { parseBlogHtmlFile } from '@/lib/cms/html-import'
import { analyzeBlogSeo, slugify, type SeoAnalysis } from '@/lib/cms/seo-analyzer'

type BlogFormProps = {
  postId?: string
}

const empty = {
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  featuredImageUrl: '',
  featuredImageAlt: '',
  category: '',
  tags: [] as string[],
  status: 'draft' as 'draft' | 'published' | 'unpublished',
  metaTitle: '',
  metaDescription: '',
  focusKeyword: '',
  displayDate: '',
}

export function BlogEditor({ postId }: BlogFormProps) {
  const router = useRouter()
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(Boolean(postId))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [seo, setSeo] = useState<SeoAnalysis | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [importNote, setImportNote] = useState('')
  const htmlInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!postId) return
    let cancelled = false
    ;(async () => {
      const response = await fetch(`/api/admin/blogs/${postId}`)
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Failed to load post')
        setLoading(false)
        return
      }
      if (cancelled) return
      setForm({
        title: data.post.title,
        slug: data.post.slug,
        excerpt: data.post.excerpt,
        body: data.post.bodyHtml || data.post.body,
        featuredImageUrl: data.post.featuredImageUrl,
        featuredImageAlt: data.post.featuredImageAlt,
        category: data.post.category,
        tags: data.post.tags || [],
        status: data.post.status,
        metaTitle: data.post.metaTitle,
        metaDescription: data.post.metaDescription,
        focusKeyword: data.post.focusKeyword,
        displayDate: data.post.displayDate,
      })
      if (data.post.slug && data.post.previewToken) {
        setPreviewUrl(`/preview/insights/${data.post.slug}?token=${data.post.previewToken}`)
      }
      setSeo(data.seo)
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [postId])

  const liveSeo = useMemo(
    () =>
      analyzeBlogSeo({
        title: form.title,
        slug: form.slug || slugify(form.title),
        excerpt: form.excerpt,
        body: form.body,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        focusKeyword: form.focusKeyword,
        featuredImageUrl: form.featuredImageUrl,
        featuredImageAlt: form.featuredImageAlt,
      }),
    [form],
  )

  async function save(status?: typeof form.status) {
    setSaving(true)
    setError('')
    const payload = {
      ...form,
      status: status ?? form.status,
      slug: form.slug || slugify(form.title),
      bodyHtml: form.body,
      body: form.body,
    }
    const response = await fetch(postId ? `/api/admin/blogs/${postId}` : '/api/admin/blogs', {
      method: postId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    setSaving(false)
    if (!response.ok) {
      setError(data.error || 'Save failed')
      return
    }
    setSeo(data.seo)
    if (data.post?.slug && data.post?.previewToken) {
      setPreviewUrl(`/preview/insights/${data.post.slug}?token=${data.post.previewToken}`)
    }
    if (!postId) {
      router.replace(`/admin/blogs/${data.post.id}`)
      router.refresh()
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    await save()
  }

  async function remove() {
    if (!postId) return
    if (!confirm('Delete this post permanently?')) return
    const response = await fetch(`/api/admin/blogs/${postId}`, { method: 'DELETE' })
    const data = await response.json()
    if (!response.ok) {
      setError(data.error || 'Delete failed (admins only)')
      return
    }
    router.replace('/admin/blogs')
    router.refresh()
  }

  async function onHtmlFileSelected(file: File | null) {
    if (!file) return
    setError('')
    setImportNote('')
    if (!/\.html?$/i.test(file.name) && file.type !== 'text/html') {
      setError('Please upload a .html file.')
      return
    }
    try {
      const text = await file.text()
      const imported = parseBlogHtmlFile(text, file.name)
      setForm((prev) => ({
        ...prev,
        title: imported.title || prev.title,
        slug: imported.slug || prev.slug || slugify(imported.title),
        excerpt: imported.excerpt || prev.excerpt,
        body: imported.bodyHtml,
        featuredImageUrl: imported.featuredImageUrl || prev.featuredImageUrl,
        featuredImageAlt: imported.featuredImageAlt || prev.featuredImageAlt,
        metaTitle: imported.metaTitle || prev.metaTitle,
        metaDescription: imported.metaDescription || prev.metaDescription,
        focusKeyword: prev.focusKeyword || imported.title.split(':')[0]?.trim() || '',
      }))
      setImportNote(`Imported “${file.name}”. Review fields, then Save or Publish.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not parse HTML file.')
    } finally {
      if (htmlInputRef.current) htmlInputRef.current.value = ''
    }
  }

  if (loading) return <p className="text-sm text-[#6b7280]">Loading post…</p>

  return (
    <form onSubmit={onSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4 rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">
            {postId ? 'Edit post' : 'New post'}
          </h2>
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
            {postId ? (
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
        {importNote ? <p className="text-sm text-emerald-700">{importNote}</p> : null}

        <div className="rounded-2xl border border-dashed border-black/15 bg-[#fafafa] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Import from HTML file</p>
              <p className="mt-1 text-xs text-[#6b7280]">
                Upload an exported article `.html` (title, meta, body, and first image are filled
                automatically).
              </p>
            </div>
            <label className="cursor-pointer rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-medium hover:bg-black/[0.03]">
              Choose HTML file
              <input
                ref={htmlInputRef}
                type="file"
                accept=".html,text/html"
                className="hidden"
                onChange={(e) => onHtmlFileSelected(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        </div>

        <Field label="Title">
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
            className="w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Slug">
            <input
              value={form.slug}
              onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
              className="w-full rounded-xl border border-black/10 px-3 py-2.5"
            />
          </Field>
          <Field label="Category">
            <input
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-xl border border-black/10 px-3 py-2.5"
            />
          </Field>
        </div>

        <Field label="Excerpt">
          <textarea
            rows={3}
            value={form.excerpt}
            onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
            className="w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </Field>

        <Field label="Body (rich text / HTML supported)">
          <textarea
            rows={16}
            value={form.body}
            onChange={(e) => setForm((prev) => ({ ...prev, body: e.target.value }))}
            className="w-full rounded-xl border border-black/10 px-3 py-2.5 font-mono text-sm"
            placeholder="Write content. Use <h2>, <p>, <ul>, <strong> for formatting."
          />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Featured image URL">
            <input
              value={form.featuredImageUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, featuredImageUrl: e.target.value }))}
              className="w-full rounded-xl border border-black/10 px-3 py-2.5"
              placeholder="Upload in Media Library, then paste URL"
            />
          </Field>
          <Field label="Featured image alt text">
            <input
              value={form.featuredImageAlt}
              onChange={(e) => setForm((prev) => ({ ...prev, featuredImageAlt: e.target.value }))}
              className="w-full rounded-xl border border-black/10 px-3 py-2.5"
            />
          </Field>
        </div>

        <Field label="Tags">
          <TagInput value={form.tags} onChange={(tags) => setForm((prev) => ({ ...prev, tags }))} />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Meta title">
            <input
              value={form.metaTitle}
              onChange={(e) => setForm((prev) => ({ ...prev, metaTitle: e.target.value }))}
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
        </div>

        <Field label="Meta description">
          <textarea
            rows={3}
            value={form.metaDescription}
            onChange={(e) => setForm((prev) => ({ ...prev, metaDescription: e.target.value }))}
            className="w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Display date">
            <input
              value={form.displayDate}
              onChange={(e) => setForm((prev) => ({ ...prev, displayDate: e.target.value }))}
              className="w-full rounded-xl border border-black/10 px-3 py-2.5"
              placeholder="June 2026"
            />
          </Field>
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status: e.target.value as typeof form.status,
                }))
              }
              className="w-full rounded-xl border border-black/10 px-3 py-2.5"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
          </Field>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      <SeoScorePanel analysis={seo || liveSeo} />
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
