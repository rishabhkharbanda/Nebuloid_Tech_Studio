'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function ImportStaticHeroSlidesButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function onImport() {
    if (
      !window.confirm(
        'Import the current homepage hero banners from site content? Existing slides with the same title will be skipped.',
      )
    ) {
      return
    }
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/admin/hero-slides/import', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Import failed')
      setMessage(`Imported ${data.imported ?? 0} slide(s).`)
      router.refresh()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Import failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onImport}
        disabled={loading}
        className="rounded-xl border border-black/10 px-4 py-2.5 text-sm font-medium disabled:opacity-60"
      >
        {loading ? 'Importing…' : 'Import site banners'}
      </button>
      {message ? <span className="text-xs text-[#6b7280]">{message}</span> : null}
    </div>
  )
}
