import type { DelhiExpoBlog } from './delhi-expo-blogs-batch1'
import { delhiExpoBlogsBatch1 } from './delhi-expo-blogs-batch1'
import { delhiExpoBlogsBatch2 } from './delhi-expo-blogs-batch2'
import { delhiExpoBlogsBatch3 } from './delhi-expo-blogs-batch3'

export type { DelhiExpoBlog }

export const delhiExpoBlogs2026: DelhiExpoBlog[] = [
  ...delhiExpoBlogsBatch1,
  ...delhiExpoBlogsBatch2,
  ...delhiExpoBlogsBatch3,
]

export function escapeBlogHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function delhiExpoBlogToHtml(post: DelhiExpoBlog) {
  return post.paragraphs.map((paragraph) => `<p>${escapeBlogHtml(paragraph)}</p>`).join('\n')
}

export function estimateWordCount(post: DelhiExpoBlog) {
  return post.paragraphs.reduce(
    (sum, paragraph) => sum + paragraph.trim().split(/\s+/).filter(Boolean).length,
    0,
  )
}
