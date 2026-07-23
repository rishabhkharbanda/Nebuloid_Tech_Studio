'use client'

import { FormEvent, useEffect, useState } from 'react'

type MediaAsset = {
  id: string
  url: string
  filename: string
  alt: string
  folder: string
  size: number
}

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [folder, setFolder] = useState('general')
  const [alt, setAlt] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  async function load() {
    const response = await fetch('/api/admin/media')
    const data = await response.json()
    if (response.ok) setAssets(data.assets || [])
  }

  useEffect(() => {
    void load()
  }, [])

  async function onUpload(event: FormEvent) {
    event.preventDefault()
    if (!file) return
    setUploading(true)
    setError('')
    const form = new FormData()
    form.set('file', file)
    form.set('alt', alt)
    form.set('folder', folder)
    const response = await fetch('/api/admin/upload', { method: 'POST', body: form })
    const data = await response.json()
    setUploading(false)
    if (!response.ok) {
      setError(data.error || 'Upload failed')
      return
    }
    setFile(null)
    setAlt('')
    await load()
  }

  async function remove(id: string) {
    if (!confirm('Delete this asset?')) return
    await fetch(`/api/admin/media/${id}`, { method: 'DELETE' })
    await load()
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Media Library</h2>
        <p className="mt-2 text-sm text-[#6b7280]">
          Upload once, reuse across blogs and digital experience cards.
        </p>
      </div>

      <form
        onSubmit={onUpload}
        className="grid gap-4 rounded-2xl border border-black/10 bg-white p-5 md:grid-cols-4"
      >
        <label className="block text-sm font-medium md:col-span-2">
          File
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-2 block w-full text-sm"
          />
        </label>
        <label className="block text-sm font-medium">
          Folder
          <input
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </label>
        <label className="block text-sm font-medium">
          Alt text
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </label>
        <button
          type="submit"
          disabled={uploading}
          className="rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60 md:col-span-4 md:w-fit"
        >
          {uploading ? 'Uploading…' : 'Upload image'}
        </button>
        {error ? <p className="text-sm text-red-600 md:col-span-4">{error}</p> : null}
      </form>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {assets.map((asset) => (
          <article key={asset.id} className="overflow-hidden rounded-2xl border border-black/10 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset.url} alt={asset.alt || asset.filename} className="aspect-video w-full object-cover" />
            <div className="space-y-2 p-3">
              <p className="truncate text-sm font-medium">{asset.filename}</p>
              <p className="truncate text-xs text-[#6b7280]">{asset.folder}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => copyUrl(asset.url)}
                  className="rounded-lg border border-black/10 px-2 py-1 text-xs"
                >
                  Copy URL
                </button>
                <button
                  type="button"
                  onClick={() => remove(asset.id)}
                  className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
