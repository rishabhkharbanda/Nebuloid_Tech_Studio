'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function SeedLocationLandingsButton() {
  const router = useRouter()
  const [seeding, setSeeding] = useState(false)
  const [message, setMessage] = useState('')

  async function seedDefaults() {
    setSeeding(true)
    setMessage('')
    try {
      const res = await fetch('/api/admin/location-landings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'seed-defaults' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Seed failed')
      setMessage(`Synced ${data.pages?.length ?? 0} location landings.`)
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Seed failed')
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={seedDefaults}
        disabled={seeding}
        className="rounded-xl border border-black/10 px-4 py-2.5 text-sm font-medium disabled:opacity-60"
      >
        {seeding ? 'Syncing…' : 'Sync static defaults'}
      </button>
      {message ? <p className="text-xs text-[#6b7280]">{message}</p> : null}
    </div>
  )
}
