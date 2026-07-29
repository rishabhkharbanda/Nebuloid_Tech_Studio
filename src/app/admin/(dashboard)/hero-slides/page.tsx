import Link from 'next/link'
import Image from 'next/image'
import { listHeroSlidesCms } from '@/lib/cms/queries'
import { ImportStaticHeroSlidesButton } from '@/components/admin/import-static-hero-slides-button'

export default async function HeroSlidesAdminPage() {
  let slides: Awaited<ReturnType<typeof listHeroSlidesCms>> = []
  let loadError = ''

  try {
    slides = await listHeroSlidesCms(true)
  } catch {
    loadError =
      'Could not load hero slides from the database. Run npm run cms:push after deploying schema changes.'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Homepage Hero Banners</h2>
          <p className="mt-2 text-sm text-[#6b7280]">
            Manage carousel images and the headline / supporting text shown with each slide.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ImportStaticHeroSlidesButton />
          <Link
            href="/admin/hero-slides/new"
            className="rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white"
          >
            Add slide
          </Link>
        </div>
      </div>

      {loadError ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {slides.length === 0 ? (
          <p className="text-sm text-[#6b7280]">
            No CMS hero slides yet. The public homepage keeps using the built-in banners until you
            import or add slides here.
          </p>
        ) : (
          slides.map((slide) => (
            <Link
              key={slide.id}
              href={`/admin/hero-slides/${slide.id}`}
              className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:border-[#d4af37]/50"
            >
              <div className="relative aspect-[16/9] bg-black/5">
                {slide.imageUrl ? (
                  <Image
                    src={slide.imageUrl}
                    alt={slide.imageAlt || slide.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : null}
              </div>
              <div className="p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[#6b7280]">
                  #{slide.displayOrder} · {slide.status} · {slide.enabled ? 'Listed' : 'Hidden'}
                </p>
                <h3 className="mt-2 text-lg font-semibold">{slide.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-[#6b7280]">{slide.description}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
