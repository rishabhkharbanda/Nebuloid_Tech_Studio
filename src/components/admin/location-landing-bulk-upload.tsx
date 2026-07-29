'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

type BulkResult = {
  savedCount: number
  failedCount: number
  saved: Array<{ id: string; title: string; slug: string; status: string; action: string }>
  failed: Array<{ title: string; error: string }>
}

const SAMPLE_TEMPLATE = [
  {
    title: 'AI Photo Booth in Chennai',
    slug: 'ai-photo-booth-chennai',
    city: 'Chennai',
    serviceLabel: 'AI Photo Booth',
    metaTitle: 'AI Photo Booth Chennai | Event AI Activations',
    metaDescription:
      'Deploy branded AI photo booths for Chennai corporate events, expos, and brand activations.',
    focusKeyword: 'AI Photo Booth Chennai',
    heroIntro: 'Short intro paragraph for the hero section.',
    whatIsIt: 'Explain the service in one or two sentences.',
    benefits: ['Benefit one', 'Benefit two'],
    features: ['Feature one', 'Feature two'],
    howItWorks: ['Step one', 'Step two'],
    industries: ['Technology', 'Corporate events'],
    useCases: ['Product launches', 'Trade shows'],
    whyChooseUs: ['Reason one', 'Reason two'],
    faqs: [
      {
        question: 'Sample FAQ question?',
        answer: 'Sample FAQ answer.',
      },
    ],
    conclusion: 'Closing paragraph with a soft CTA.',
    relatedPaths: [
      { label: 'AI Photo Booth technology', href: '/technology/ai-photo-booths' },
      { label: 'Contact Nebuloid', href: '/contact' },
    ],
    status: 'draft',
  },
]

function parseBulkJson(raw: string) {
  const parsed = JSON.parse(raw) as unknown
  if (Array.isArray(parsed)) return parsed
  if (
    parsed &&
    typeof parsed === 'object' &&
    'pages' in parsed &&
    Array.isArray((parsed as { pages: unknown }).pages)
  ) {
    return (parsed as { pages: unknown[] }).pages
  }
  throw new Error('JSON must be an array of landings or an object with a "pages" array.')
}

export function LocationLandingBulkUpload() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [jsonText, setJsonText] = useState('')
  const [status, setStatus] = useState<'draft' | 'published' | 'unpublished'>('draft')
  const [upsert, setUpsert] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<BulkResult | null>(null)

  function downloadTemplate() {
    const blob = new Blob([JSON.stringify(SAMPLE_TEMPLATE, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'location-landings-template.json'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  async function onFileSelected(list: FileList | null) {
    if (!list?.[0]) return
    const file = list[0]
    if (!/\.json$/i.test(file.name) && file.type !== 'application/json') {
      setError('Please select a .json file.')
      return
    }
    setError('')
    setResult(null)
    setJsonText(await file.text())
  }

  async function upload() {
    if (!jsonText.trim()) {
      setError('Paste JSON or upload a .json file.')
      return
    }

    setUploading(true)
    setError('')
    setResult(null)

    try {
      const pages = parseBulkJson(jsonText.trim())
      const response = await fetch('/api/admin/location-landings/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pages, status, upsert }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Bulk upload failed')
      }

      setResult({
        savedCount: data.savedCount ?? 0,
        failedCount: data.failedCount ?? 0,
        saved: data.saved ?? [],
        failed: data.failed ?? [],
      })
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
            Import or update multiple location landings from one JSON file (max 25).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={downloadTemplate}
            className="rounded-xl border border-black/10 px-3 py-2 text-sm font-medium"
          >
            Download template
          </button>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-xl border border-black/10 px-3 py-2 text-sm font-medium"
          >
            {open ? 'Hide' : 'Bulk upload'}
          </button>
        </div>
      </div>

      {open ? (
        <div className="mt-4 space-y-4 border-t border-black/5 pt-4">
          <label className="block text-sm font-medium">
            JSON file
            <input
              ref={inputRef}
              type="file"
              accept=".json,application/json"
              onChange={(e) => onFileSelected(e.target.files)}
              className="mt-2 block w-full text-sm"
            />
          </label>

          <label className="block text-sm font-medium">
            Or paste JSON
            <textarea
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value)
                setError('')
                setResult(null)
              }}
              rows={12}
              placeholder='[{ "title": "...", "slug": "...", ... }]'
              className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5 font-mono text-xs"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium">
              Default status
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as 'draft' | 'published' | 'unpublished')
                }
                className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="unpublished">Unpublished</option>
              </select>
            </label>
            <label className="mt-6 flex items-center gap-2 text-sm font-normal md:mt-8">
              <input
                type="checkbox"
                checked={upsert}
                onChange={(e) => setUpsert(e.target.checked)}
              />
              Update existing pages when slug matches
            </label>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          {result ? (
            <div className="rounded-xl border border-black/5 bg-[#fafafa] px-3 py-3 text-sm">
              <p className="font-medium text-emerald-700">
                Saved {result.savedCount} landing{result.savedCount === 1 ? '' : 's'}
                {result.failedCount ? ` · ${result.failedCount} failed` : ''}
              </p>
              {result.saved.length > 0 ? (
                <ul className="mt-2 space-y-1 text-xs text-[#6b7280]">
                  {result.saved.map((item) => (
                    <li key={item.id}>
                      {item.action === 'updated' ? 'Updated' : 'Created'}: {item.title} (/
                      {item.slug})
                    </li>
                  ))}
                </ul>
              ) : null}
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
            disabled={uploading || !jsonText.trim()}
            onClick={upload}
            className="rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {uploading ? 'Uploading…' : 'Import location landings'}
          </button>
        </div>
      ) : null}
    </div>
  )
}
