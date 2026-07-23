'use client'

import { useState } from 'react'
import type { SeoAnalysis } from '@/lib/cms/seo-analyzer'
import { cn } from '@/lib/utils'

export function SeoScorePanel({ analysis }: { analysis: SeoAnalysis | null }) {
  if (!analysis) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-5 text-sm text-[#6b7280]">
        Save or update the post to refresh the SEO score.
      </div>
    )
  }

  const tone =
    analysis.score >= 80 ? 'text-emerald-700' : analysis.score >= 60 ? 'text-amber-700' : 'text-red-700'

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
            SEO Analyzer
          </p>
          <p className={cn('mt-2 text-4xl font-semibold', tone)}>{analysis.score}</p>
        </div>
        <p className="text-xs text-[#6b7280]">/ 100</p>
      </div>
      <ul className="mt-5 space-y-3">
        {analysis.issues.map((issue) => (
          <li key={issue.id} className="rounded-xl border border-black/5 px-3 py-2">
            <p
              className={cn(
                'text-sm font-medium',
                issue.severity === 'pass' && 'text-emerald-700',
                issue.severity === 'warning' && 'text-amber-700',
                issue.severity === 'error' && 'text-red-700',
              )}
            >
              {issue.message}
            </p>
            <p className="mt-1 text-xs text-[#6b7280]">{issue.tip}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function TagInput({
  value,
  onChange,
}: {
  value: string[]
  onChange: (tags: string[]) => void
}) {
  const [draft, setDraft] = useState('')
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="rounded-full bg-black/5 px-3 py-1 text-xs"
          >
            {tag} ×
          </button>
        ))}
      </div>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            const next = draft.trim()
            if (!next || value.includes(next)) return
            onChange([...value, next])
            setDraft('')
          }
        }}
        placeholder="Add tag and press Enter"
        className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
      />
    </div>
  )
}
