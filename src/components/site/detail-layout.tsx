import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'

type DetailSection = {
  title: string
  content: string
}

type DetailGalleryItem = {
  src: string
  alt: string
  label?: string
}

type DetailLayoutProps = {
  backHref: string
  backLabel: string
  category: string
  title: string
  image: string
  intro: string
  sections: DetailSection[]
  highlights?: string[]
  meta?: string[]
  gallery?: DetailGalleryItem[]
  galleryTitle?: string
}

export function DetailLayout({
  backHref,
  backLabel,
  category,
  title,
  image,
  intro,
  sections,
  highlights = [],
  meta = [],
  gallery = [],
  galleryTitle = 'Sample Outputs',
}: DetailLayoutProps) {
  return (
    <article className="section-padding pb-32">
      <div className="content-grid">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#F1E9DB]/50 transition-colors hover:text-[#d4af37]"
        >
          <ArrowLeft size={14} />
          {backLabel}
        </Link>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
              {category}
            </p>
            <h1 className="mt-4 text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.95] tracking-[-0.03em]">
              {title}
            </h1>

            {meta.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {meta.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#F1E9DB]/55"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-8 text-lg leading-relaxed text-[#F1E9DB]/75 md:text-xl">
              {intro}
            </p>

            <div className="mt-12 space-y-10 border-t border-white/10 pt-12">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#F1E9DB] md:text-2xl">
                    {section.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-[#F1E9DB]/65 md:text-lg">
                    {section.content}
                  </p>
                </section>
              ))}
            </div>

            {highlights.length > 0 && (
              <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-10">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4af37]">
                  Key Deliverables
                </p>
                <ul className="mt-6 space-y-3">
                  {highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[#F1E9DB]/70"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4af37]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-8">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c]">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              <Link
                href="/contact"
                className="group inline-flex w-full items-center justify-between rounded-full border border-[#F1E9DB]/25 px-6 py-4 text-sm font-medium transition-all duration-300 hover:border-[#d4af37]/50 hover:bg-[#F1E9DB]/5 md:text-base"
              >
                Start a Collaboration
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F1E9DB]/20 transition-all group-hover:border-[#d4af37]/40">
                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {gallery.length > 0 && (
          <div className="mt-20 border-t border-white/10 pt-16 md:mt-24 md:pt-20">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
              {galleryTitle}
            </p>
            <h2 className="mt-4 max-w-3xl text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-[-0.03em]">
              Branded AI-generated photos from the pavilion experience
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {gallery.map((item) => (
                <figure
                  key={item.src}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c]"
                >
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 20vw"
                    />
                  </div>
                  {item.label && (
                    <figcaption className="border-t border-white/10 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#F1E9DB]/55">
                      {item.label}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
