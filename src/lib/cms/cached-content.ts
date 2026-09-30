import { unstable_cache } from 'next/cache'
import {
  getBlogPostsForListing,
  getDigitalExperienceCards,
  getExperienceServices,
} from '@/lib/content'
import { CMS_CACHE_TAG, ONE_DAY_IN_SECONDS } from '@/lib/cms/cache-config'

const cacheOptions = { revalidate: ONE_DAY_IN_SECONDS, tags: [CMS_CACHE_TAG] }

export const getBlogPostsForListingCached = unstable_cache(
  getBlogPostsForListing,
  ['blog-posts-listing'],
  cacheOptions,
)

export const getDigitalExperienceCardsCached = unstable_cache(
  getDigitalExperienceCards,
  ['digital-experience-cards'],
  cacheOptions,
)

export const getExperienceServicesCached = unstable_cache(
  getExperienceServices,
  ['experience-services'],
  cacheOptions,
)
