'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SeoScorePanel } from '@/components/admin/seo-score-panel'
import { analyzeBlogSeo, slugify, type SeoAnalysis } from '@/lib/cms/seo-analyzer'

type Props = { pageId?: string }

const empty = {
  title: '',
  slug: '',
  city: '',
  serviceLabel: '',
  heroIntro: '',
  whatIsIt: '',
  benefitsText: '',
  featuresText: '',
  howItWorksText: '',
  industriesText: '',
  useCasesText: '',
  whyChooseUsText: '',
  faqsText: '',
  conclusion: '',
  relatedPathsText: '',
  status: 'draft' as 'draft' | 'published' | 'unpublished',
  metaTitle: '',
  metaDescription: '',
  focusKeyword: '',
  canonicalPath: '',
  ogImageUrl: '',
  twitterImageUrl: '',
  robotsIndex: true,
  schemaType: 'Service',
}

function lines(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function parseFaqs(text: string) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [question = '', answer = ''] = line.split('|').map((part) => part.trim())
      return { question, answer }
    })
    .filter((item) => item.question && item.answer)
}

function parseRelated(text: string) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = '', href = ''] = line.split('|').map((part) => part.trim())
      return { label, href }
    })
    .filter((item) => item.label && item.href)
}

export function LocationLandingEditor({ pageId }: Props) {
  const router = useRouter()
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(Boolean(pageId))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [seo, setSeo] = useState<SeoAnalysis | null>(null)

  useEffect(() => {
    if (!pageId) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/admin/location-landings/${pageId}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to load')
        if (cancelled) return
        const page = data.page
        setForm({
          title: page.title || '',
          slug: page.slug || '',
          city: page.city || '',
          serviceLabel: page.serviceLabel || '',
          heroIntro: page.heroIntro || '',
          whatIsIt: page.whatIsIt || '',
          benefitsText: (page.benefits || []).join('\n'),
          featuresText: (page.features || []).join('\n'),
          howItWorksText: (page.howItWorks || []).join('\n'),
          industriesText: (page.industries || []).join('\n'),
          useCasesText: (page.useCases || []).join('\n'),
          whyChooseUsText: (page.whyChooseUs || []).join('\n'),
          faqsText: (page.faqs || [])
            .map((faq: { question: string; answer: string }) => `${faq.question} | ${faq.answer}`)
            .join('\n'),
          conclusion: page.conclusion || '',
          relatedPathsText: (page.relatedPaths || [])
            .map((link: { label: string; href: string }) => `${link.label} | ${link.href}`)
            .join('\n'),
          status: page.status || 'draft',
          metaTitle: page.metaTitle || '',
          metaDescription: page.metaDescription || '',
          focusKeyword: page.focusKeyword || '',
          canonicalPath: page.canonicalPath || '',
          ogImageUrl: page.ogImageUrl || '',
          twitterImageUrl: page.twitterImageUrl || '',
          robotsIndex: page.robotsIndex !== false,
          schemaType: page.schemaType || 'Service',
        })
        setSeo(data.seo || null)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [pageId])

  const liveSeo = useMemo(
    () =>
      analyzeBlogSeo({
        title: form.title,
        slug: form.slug || slugify(form.title),
        excerpt: form.metaDescription || form.heroIntro,
        body: [form.whatIsIt, form.conclusion, form.benefitsText, form.featuresText].join('\n'),
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        focusKeyword: form.focusKeyword,
        featuredImageUrl: form.ogImageUrl,
        featuredImageAlt: form.title,
        canonicalPath: form.canonicalPath || `/${form.slug || slugify(form.title)}`,
        ogImageUrl: form.ogImageUrl,
        robotsIndex: form.robotsIndex,
      }),
    [form],
  )

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        city: form.city,
        serviceLabel: form.serviceLabel,
        heroIntro: form.heroIntro,
        whatIsIt: form.whatIsIt,
        benefits: lines(form.benefitsText),
        features: lines(form.featuresText),
        howItWorks: lines(form.howItWorksText),
        industries: lines(form.industriesText),
        useCases: lines(form.useCasesText),
        whyChooseUs: lines(form.whyChooseUsText),
        faqs: parseFaqs(form.faqsText),
        conclusion: form.conclusion,
        relatedPaths: parseRelated(form.relatedPathsText),
        status: form.status,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        focusKeyword: form.focusKeyword,
        canonicalPath: form.canonicalPath || `/${form.slug || slugify(form.title)}`,
        ogImageUrl: form.ogImageUrl,
        twitterImageUrl: form.twitterImageUrl,
        robotsIndex: form.robotsIndex,
        schemaType: form.schemaType,
      }
      const res = await fetch(
        pageId ? `/api/admin/location-landings/${pageId}` : '/api/admin/location-landings',
        {
          method: pageId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      setSeo(data.seo || null)
      if (!pageId && data.page?.id) {
        router.replace(`/admin/location-landings/${data.page.id}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-sm text-[#6b7280]">Loading…</p>

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <Field label="Title">
          <input
            required
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="URL slug">
            <input
              value={form.slug}
              onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
              className="w-full rounded-xl border border-black/10 px-3 py-2.5"
              placeholder="ai-photo-booth-delhi"
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
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="City">
            <input
              value={form.city}
              onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
              className="w-full rounded-xl border border-black/10 px-3 py-2.5"
            />
          </Field>
          <Field label="Service label">
            <input
              value={form.serviceLabel}
              onChange={(e) => setForm((prev) => ({ ...prev, serviceLabel: e.target.value }))}
              className="w-full rounded-xl border border-black/10 px-3 py-2.5"
            />
          </Field>
        </div>
        <Field label="Hero intro">
          <textarea
            rows={3}
            value={form.heroIntro}
            onChange={(e) => setForm((prev) => ({ ...prev, heroIntro: e.target.value }))}
            className="w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </Field>
        <Field label="What is it?">
          <textarea
            rows={4}
            value={form.whatIsIt}
            onChange={(e) => setForm((prev) => ({ ...prev, whatIsIt: e.target.value }))}
            className="w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </Field>
        {(
          [
            ['benefitsText', 'Benefits (one per line)'],
            ['featuresText', 'Features (one per line)'],
            ['howItWorksText', 'How it works (one per line)'],
            ['industriesText', 'Industries (one per line)'],
            ['useCasesText', 'Use cases (one per line)'],
            ['whyChooseUsText', 'Why choose us (one per line)'],
          ] as const
        ).map(([key, label]) => (
          <Field key={key} label={label}>
            <textarea
              rows={4}
              value={form[key]}
              onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
              className="w-full rounded-xl border border-black/10 px-3 py-2.5"
            />
          </Field>
        ))}
        <Field label="FAQs (question | answer per line)">
          <textarea
            rows={5}
            value={form.faqsText}
            onChange={(e) => setForm((prev) => ({ ...prev, faqsText: e.target.value }))}
            className="w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </Field>
        <Field label="Conclusion">
          <textarea
            rows={3}
            value={form.conclusion}
            onChange={(e) => setForm((prev) => ({ ...prev, conclusion: e.target.value }))}
            className="w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </Field>
        <Field label="Related paths (label | href per line)">
          <textarea
            rows={4}
            value={form.relatedPathsText}
            onChange={(e) => setForm((prev) => ({ ...prev, relatedPathsText: e.target.value }))}
            className="w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </Field>

        <div className="rounded-2xl border border-black/10 bg-[#fafafa] p-4">
          <p className="text-sm font-semibold">SEO panel</p>
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
              />
            </Field>
            <Field label="Schema type">
              <select
                value={form.schemaType}
                onChange={(e) => setForm((prev) => ({ ...prev, schemaType: e.target.value }))}
                className="w-full rounded-xl border border-black/10 px-3 py-2.5"
              >
                <option value="Service">Service</option>
                <option value="LocalBusiness">LocalBusiness</option>
                <option value="WebPage">WebPage</option>
              </select>
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
          <label className="mt-4 inline-flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={form.robotsIndex}
              onChange={(e) => setForm((prev) => ({ ...prev, robotsIndex: e.target.checked }))}
            />
            Allow search indexing
          </label>
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
          description: form.metaDescription || form.heroIntro,
          slug: form.slug || slugify(form.title),
          imageUrl: form.ogImageUrl,
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
