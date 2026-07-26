'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { parseBlogHtmlFile } from '@/lib/cms/html-import'

type BulkResult = {
  createdCount: number
  failedCount: number
  created: Array<{ id: string; title: string; slug: string; status: string }>
  failed: Array<{ title: string; error: string }>
}

export function BlogBulkUpload() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [category, setCategory] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<BulkResult | null>(null)

  function onFilesSelected(list: FileList | null) {
    if (!list?.length) return
    const next = Array.from(list).filter(
      (file) => /\.html?$/i.test(file.name) || file.type === 'text/html',
    )
    if (!next.length) {
      setError('Please select one or more .html files.')
      return
    }
    if (next.length > 50) {
      setError('You can upload a maximum of 50 HTML files at once.')
      return
    }
    setError('')
    setResult(null)
    setFiles(next)
  }

  async function upload() {
    if (!files.length) {
      setError('Choose HTML files to upload.')
      return
    }

    setUploading(true)
    setError('')
    setResult(null)

    try {
      const posts = []
      for (const file of files) {
        const text = await file.text()
        const imported = parseBlogHtmlFile(text, file.name)
        posts.push({
          title: imported.title,
          slug: imported.slug,
          excerpt: imported.excerpt,
          body: imported.bodyHtml,
          bodyHtml: imported.bodyHtml,
          featuredImageUrl: imported.featuredImageUrl,
          featuredImageAlt: imported.featuredImageAlt,
          metaTitle: imported.metaTitle,
          metaDescription: imported.metaDescription,
          focusKeyword: imported.title.split(':')[0]?.trim() || '',
          category,
          status,
        })
      }

      const response = await fetch('/api/admin/blogs/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts, status, category }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Bulk upload failed')
      }

      setResult({
        createdCount: data.createdCount ?? 0,
        failedCount: data.failedCount ?? 0,
        created: data.created ?? [],
        failed: data.failed ?? [],
      })
      setFiles([])
      if (inputRef.current) inputRef.current.value = ''
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bulk upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Bulk upload</h3>
          <p className="mt-1 text-xs text-[#6b7280]">
            Import multiple blog HTML files at once (max 50).
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-xl border border-black/10 px-3 py-2 text-sm font-medium"
        >
          {open ? 'Hide' : 'Bulk upload'}
        </button>
      </div>

      {open ? (
        <div className="mt-4 space-y-4 border-t border-black/5 pt-4">
          <label className="block text-sm font-medium">
            HTML files
            <input
              ref={inputRef}
              type="file"
              accept=".html,text/html"
              multiple
              onChange={(e) => onFilesSelected(e.target.files)}
              className="mt-2 block w-full text-sm"
            />
          </label>

          {files.length > 0 ? (
            <p className="text-xs text-[#6b7280]">
              {files.length} file{files.length === 1 ? '' : 's'} selected
            </p>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium">
              Default status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
            <label className="block text-sm font-medium">
              Default category (optional)
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Insights"
                className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
              />
            </label>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          {result ? (
            <div className="rounded-xl border border-black/5 bg-[#fafafa] px-3 py-3 text-sm">
              <p className="font-medium text-emerald-700">
                Created {result.createdCount} post{result.createdCount === 1 ? '' : 's'}
                {result.failedCount ? ` · ${result.failedCount} failed` : ''}
              </p>
              {result.failed.length > 0 ? (
                <ul className="mt-2 space-y-1 text-xs text-red-700">
                  {result.failed.map((item) => (
                    <li key={`${item.title}-${item.error}`}>
                      {item.title}: {item.error}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          <button
            type="button"
            disabled={uploading || files.length === 0}
            onClick={upload}
            className="rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {uploading ? 'Uploading…' : `Upload ${files.length || ''} post${files.length === 1 ? '' : 's'}`}
          </button>
        </div>
      ) : null}
    </div>
  )
}
