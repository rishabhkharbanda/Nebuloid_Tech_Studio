'use client'

import { useState } from 'react'
import type { SeoAnalysis } from '@/lib/cms/seo-analyzer'
import { cn } from '@/lib/utils'

type PreviewProps = {
  title: string
  description: string
  slug: string
  imageUrl?: string
}

export function SeoScorePanel({
  analysis,
  preview,
}: {
  analysis: SeoAnalysis | null
  preview?: PreviewProps
}) {
  if (!analysis) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-5 text-sm text-[#6b7280]">
        Save or update the post to refresh the SEO score.
      </div>
    )
  }

  const tone =
    analysis.score >= 80 ? 'text-emerald-700' : analysis.score >= 60 ? 'text-amber-700' : 'text-red-700'
  const serpTitle = (preview?.title || 'Untitled').slice(0, 60)
  const serpDesc = (preview?.description || '').slice(0, 160)
  const serpUrl = `www.nebuloidtechstudio.com › insights › ${(preview?.slug || 'slug').replace(/\//g, ' › ')}`

  return (
    <div className="space-y-4">
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
        <ul className="mt-5 max-h-[28rem] space-y-3 overflow-auto pr-1">
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

      {preview ? (
        <>
          <div className="rounded-2xl border border-black/10 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
              Google preview
            </p>
            <div className="mt-3">
              <p className="truncate text-xs text-[#202124]">{serpUrl}</p>
              <p className="mt-1 text-lg leading-snug text-[#1a0dab]">{serpTitle || 'Page title'}</p>
              <p className="mt-1 text-sm leading-snug text-[#4d5156]">{serpDesc || 'Meta description'}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
              Social preview
            </p>
            <div className="mt-3 overflow-hidden rounded-xl border border-black/10">
              <div
                className="aspect-[1.91/1] bg-[#e5e7eb] bg-cover bg-center"
                style={
                  preview.imageUrl
                    ? { backgroundImage: `url(${preview.imageUrl})` }
                    : undefined
                }
              />
              <div className="space-y-1 bg-[#f3f4f6] px-3 py-2">
                <p className="text-[10px] uppercase tracking-wide text-[#6b7280]">
                  nebuloidtechstudio.com
                </p>
                <p className="line-clamp-2 text-sm font-semibold text-[#111827]">
                  {preview.title || 'Untitled'}
                </p>
                <p className="line-clamp-2 text-xs text-[#4b5563]">
                  {preview.description || 'Description'}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : null}
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
