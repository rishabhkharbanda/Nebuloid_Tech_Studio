import  { revalidatePath, revalidateTag } from 'next/cache'
import { CMS_CACHE_TAG } from '@/lib/cms/cache-config'

export function refreshPublicSite(){
    revalidateTag(CMS_CACHE_TAG, { expire: 0})
    revalidatePath('/', 'layout')
}