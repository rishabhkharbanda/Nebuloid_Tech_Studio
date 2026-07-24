import type { BlobAccessType } from '@vercel/blob'

/** Matches the Vercel Blob store access mode. Cannot be changed after store creation. */
export function getBlobAccess(): BlobAccessType {
  const configured = process.env.BLOB_ACCESS?.trim().toLowerCase()
  if (configured === 'public') return 'public'
  return 'private'
}

export function mediaProxyPath(pathname: string) {
  const cleaned = pathname.replace(/^\/+/, '')
  return `/api/media/${cleaned
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')}`
}
