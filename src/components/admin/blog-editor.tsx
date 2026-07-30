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
  canonicalPath: '',
  ogImageUrl: '',
  twitterImageUrl: '',
  robotsIndex: true,
  authorName: 'Nebuloid Tech Studio',
  schemaType: 'BlogPosting',
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
  const [imageMode, setImageMode] = useState<'image' | 'none'>('image')
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
        canonicalPath: data.post.canonicalPath || '',
        ogImageUrl: data.post.ogImageUrl || '',
        twitterImageUrl: data.post.twitterImageUrl || '',
        robotsIndex: data.post.robotsIndex ?? true,
        authorName: data.post.authorName || 'Nebuloid Tech Studio',
        schemaType: data.post.schemaType || 'BlogPosting',
        displayDate: data.post.displayDate,
      })
      setImageMode(data.post.featuredImageUrl?.trim() ? 'image' : 'none')
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
        canonicalPath: form.canonicalPath || `/insights/${form.slug || slugify(form.title)}`,
        ogImageUrl: form.ogImageUrl || form.featuredImageUrl,
        robotsIndex: form.robotsIndex,
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
      // "No image" clears URL only — alt text is never auto-changed.
      featuredImageUrl: imageMode === 'none' ? '' : form.featuredImageUrl.trim(),
      featuredImageAlt: form.featuredImageAlt,
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
      if (imported.featuredImageUrl) setImageMode('image')
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

        <div className="space-y-4 rounded-2xl border border-black/10 bg-[#fafafa] p-4">
          <div>
            <p className="text-sm font-semibold">Featured image</p>
            <p className="mt-1 text-xs text-[#6b7280]">
              Choose Image or No image. Alt text is stored exactly as typed and is never overwritten.
              Posts without an image use the site default cover (Admin → Settings).
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setImageMode('image')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${
                imageMode === 'image'
                  ? 'bg-[#111827] text-white'
                  : 'border border-black/10 bg-white text-[#374151]'
              }`}
            >
              Image
            </button>
            <button
              type="button"
              onClick={() => {
                setImageMode('none')
                setForm((prev) => ({
                  ...prev,
                  featuredImageUrl: '',
                  // Keep featuredImageAlt as-is.
                }))
              }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${
                imageMode === 'none'
                  ? 'bg-[#111827] text-white'
                  : 'border border-black/10 bg-white text-[#374151]'
              }`}
            >
              No image
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Featured image URL">
              <input
                value={form.featuredImageUrl}
                onChange={(e) => {
                  setImageMode('image')
                  setForm((prev) => ({ ...prev, featuredImageUrl: e.target.value }))
                }}
                className="w-full rounded-xl border border-black/10 px-3 py-2.5 disabled:bg-black/[0.03]"
                placeholder="Upload in Media Library, then paste URL"
                disabled={imageMode === 'none'}
              />
              {imageMode === 'none' ? (
                <p className="mt-1.5 text-xs text-[#6b7280]">
                  No image — public article will show the default cover.
                </p>
              ) : null}
            </Field>
            <Field label="Featured image alt text">
              <input
                value={form.featuredImageAlt}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, featuredImageAlt: e.target.value }))
                }
                className="w-full rounded-xl border border-black/10 px-3 py-2.5"
                placeholder="Saved as-is (not auto-filled)"
              />
            </Field>
          </div>
        </div>

        <Field label="Tags">
          <TagInput value={form.tags} onChange={(tags) => setForm((prev) => ({ ...prev, tags }))} />
        </Field>

        <div className="rounded-2xl border border-black/10 bg-[#fafafa] p-4">
          <p className="text-sm font-semibold">SEO panel</p>
          <p className="mt-1 text-xs text-[#6b7280]">
            Title, description, canonical, social images, robots, and schema controls.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="SEO title">
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
              className="mt-4 w-full rounded-xl border border-black/10 px-3 py-2.5"
            />
          </Field>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Canonical path">
              <input
                value={form.canonicalPath}
                onChange={(e) => setForm((prev) => ({ ...prev, canonicalPath: e.target.value }))}
                className="w-full rounded-xl border border-black/10 px-3 py-2.5"
                placeholder="/insights/your-slug"
              />
            </Field>
            <Field label="Author">
              <input
                value={form.authorName}
                onChange={(e) => setForm((prev) => ({ ...prev, authorName: e.target.value }))}
                className="w-full rounded-xl border border-black/10 px-3 py-2.5"
              />
            </Field>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Open Graph image URL">
              <input
                value={form.ogImageUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, ogImageUrl: e.target.value }))}
                className="w-full rounded-xl border border-black/10 px-3 py-2.5"
              />
            </Field>
            <Field label="Twitter image URL">
              <input
                value={form.twitterImageUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, twitterImageUrl: e.target.value }))}
                className="w-full rounded-xl border border-black/10 px-3 py-2.5"
              />
            </Field>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Schema type">
              <select
                value={form.schemaType}
                onChange={(e) => setForm((prev) => ({ ...prev, schemaType: e.target.value }))}
                className="w-full rounded-xl border border-black/10 px-3 py-2.5"
              >
                <option value="BlogPosting">BlogPosting</option>
                <option value="Article">Article</option>
                <option value="NewsArticle">NewsArticle</option>
              </select>
            </Field>
            <label className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.robotsIndex}
                onChange={(e) => setForm((prev) => ({ ...prev, robotsIndex: e.target.checked }))}
              />
              Allow search indexing
            </label>
          </div>
        </div>

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

      <SeoScorePanel
        analysis={seo || liveSeo}
        preview={{
          title: form.metaTitle || form.title,
          description: form.metaDescription || form.excerpt,
          slug: form.slug || slugify(form.title),
          imageUrl: form.ogImageUrl || form.featuredImageUrl,
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
