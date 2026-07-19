import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { DetailGalleryCarousel } from '@/components/site/detail-gallery-carousel'

type DetailSection =
  | { title: string; content: string; items?: never }
  | { title: string; items: string[]; content?: never }

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
  sections?: DetailSection[]
  highlights?: string[]
  meta?: string[]
  gallery?: DetailGalleryItem[]
  galleryTitle?: string
  galleryHeading?: string
  galleryAspect?: 'portrait' | 'video'
}

function ChipList({ items }: { items: string[] }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#F1E9DB]/65"
        >
          {item}
        </span>
      ))}
    </div>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[#F1E9DB]/70">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4af37]" />
          {item}
        </li>
      ))}
    </ul>
  )
}

export function DetailLayout({
  backHref,
  backLabel,
  category,
  title,
  image,
  intro,
  sections = [],
  highlights = [],
  meta = [],
  gallery = [],
  galleryTitle = 'Gallery',
  galleryHeading = 'Project visuals',
  galleryAspect = 'portrait',
}: DetailLayoutProps) {
  const hasGallery = gallery.length > 0

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

        <header className="mt-12 max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            {category}
          </p>
          <h1 className="mt-4 text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.95] tracking-[-0.03em]">
            {title}
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-[#F1E9DB]/75 md:text-xl">
            {intro}
          </p>
          {meta.length > 0 && <ChipList items={meta} />}
        </header>

        {hasGallery ? (
          <section className="mt-14 md:mt-16">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
              {galleryTitle}
            </p>
            <h2 className="mt-3 max-w-3xl text-[clamp(1.5rem,3.5vw,2.5rem)] font-semibold tracking-[-0.03em]">
              {galleryHeading}
            </h2>
            <DetailGalleryCarousel items={gallery} aspect={galleryAspect} />
          </section>
        ) : (
          <div className="relative mt-14 aspect-[16/10] overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c] md:mt-16">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        )}

        <div className="mt-16 grid gap-10 border-t border-white/10 pt-14 md:mt-20 md:grid-cols-12 md:gap-12 md:pt-16">
          {highlights.length > 0 && (
            <section className="md:col-span-5">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4af37]">
                Key Deliverables
              </p>
              <BulletList items={highlights} />
            </section>
          )}

          <div
            className={
              highlights.length > 0
                ? 'space-y-10 md:col-span-7'
                : 'space-y-10 md:col-span-12'
            }
          >
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#F1E9DB] md:text-2xl">
                  {section.title}
                </h2>
                {'items' in section && section.items ? (
                  section.items.length <= 8 ? (
                    <ChipList items={section.items} />
                  ) : (
                    <BulletList items={section.items} />
                  )
                ) : (
                  <p className="mt-4 leading-relaxed text-[#F1E9DB]/65 md:text-lg">
                    {section.content}
                  </p>
                )}
              </section>
            ))}
          </div>
        </div>

        <div className="mt-14 md:mt-16">
          <Link
            href="/contact"
            className="group inline-flex w-full max-w-xl items-center justify-between rounded-full border border-[#F1E9DB]/25 px-6 py-4 text-sm font-medium transition-all duration-300 hover:border-[#d4af37]/50 hover:bg-[#F1E9DB]/5 md:text-base"
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
    </article>
  )
}
