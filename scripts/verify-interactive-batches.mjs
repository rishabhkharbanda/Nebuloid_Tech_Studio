import { readFileSync } from 'node:fs'

const EXPECTED_SECTIONS = [
  'Product Overview',
  'Key Features',
  'How It Works',
  'Business Benefits',
  'Technical Specifications',
  'Applications Across Industries',
  'Why Choose This Solution',
  'Ready to Deploy',
]

const files = [
  ['src/lib/interactive-products-batch1.ts', 'interactiveProductsBatch1'],
  ['src/lib/interactive-products-batch3.ts', 'interactiveProductsBatch3'],
]

let failures = 0

for (const [file, exportName] of files) {
  const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
  const body = source.replace(`export const ${exportName} =`, 'return').replace(/ as const\s*$/, '')
  const products = new Function(`${body}`)()

  console.log(`\n${file} -> ${exportName}: ${products.length} products`)

  for (const p of products) {
    const problems = []
    const faqCount = p.geo?.faqs?.length ?? 0
    if (faqCount !== 12) problems.push(`faqs=${faqCount} (expected 12)`)

    const titles = (p.sections ?? []).map((s) => s.title)
    if (titles.length !== 8 || titles.some((t, i) => t !== EXPECTED_SECTIONS[i])) {
      problems.push(`sections mismatch: ${JSON.stringify(titles)}`)
    }

    for (const key of [
      'id',
      'slug',
      'title',
      'description',
      'detail',
      'tags',
      'image',
      'imageAlt',
      'intro',
      'metaTitle',
      'metaDescription',
      'focusKeyword',
      'highlights',
      'sections',
      'geo',
    ]) {
      if (p[key] === undefined) problems.push(`missing ${key}`)
    }

    for (const key of [
      'whatIsIt',
      'benefits',
      'features',
      'howItWorks',
      'industries',
      'useCases',
      'whyChooseUs',
      'faqs',
      'conclusion',
      'relatedLinks',
    ]) {
      if (p.geo?.[key] === undefined) problems.push(`missing geo.${key}`)
    }

    const badFaq = (p.geo?.faqs ?? []).findIndex((f) => !f.question || !f.answer)
    if (badFaq >= 0) problems.push(`faq ${badFaq} missing question/answer`)

    const overviewWords = (p.sections?.[0]?.content ?? '').split(/\s+/).filter(Boolean).length

    if (problems.length) {
      failures += 1
      console.log(`  FAIL ${p.id} ${p.slug}: ${problems.join('; ')}`)
    } else {
      console.log(
        `  OK   ${p.id} ${p.slug} | faqs=${faqCount} | sections=8 | overview=${overviewWords} words`,
      )
    }
  }
}

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} product(s) failed.`)
process.exit(failures === 0 ? 0 : 1)
