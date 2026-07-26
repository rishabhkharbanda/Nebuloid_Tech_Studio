'use client'

import { useEffect, useEffectEvent, useState } from 'react'
import { Check, Link2, Share2 } from 'lucide-react'

type BlogArticleToolsProps = {
  title: string
  url: string
}

export function BlogArticleTools({ title, url }: BlogArticleToolsProps) {
  const [progress, setProgress] = useState(0)
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function')
  }, [])

  const onScroll = useEffectEvent(() => {
    const article = document.getElementById('blog-article-body')
    if (!article) return
    const rect = article.getBoundingClientRect()
    const total = article.offsetHeight - window.innerHeight
    const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1))
    setProgress(Math.round((scrolled / Math.max(total, 1)) * 100))
  })

  useEffect(() => {
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  async function share() {
    if (canNativeShare) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        // Fall through to copy.
      }
    }
    await copyLink()
  }

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] bg-white/5"
        aria-hidden
      >
        <div
          className="h-full bg-[#d4af37] transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#F1E9DB]/55 transition hover:border-[#d4af37]/40 hover:text-[#d4af37]"
        >
          {copied ? <Check size={13} /> : <Link2 size={13} />}
          {copied ? 'Copied' : 'Copy link'}
        </button>
        <button
          type="button"
          onClick={share}
          className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#F1E9DB]/55 transition hover:border-[#d4af37]/40 hover:text-[#d4af37]"
        >
          <Share2 size={13} />
          Share
        </button>
      </div>
    </>
  )
}
