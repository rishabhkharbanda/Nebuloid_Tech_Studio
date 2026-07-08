import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

type ListingItem = {
  href: string
  title: string
  category: string
  description: string
  image?: string
  meta?: string
}

type ListingPageProps = {
  label: string
  title: string
  description: string
  items: ListingItem[]
}

export function ListingPage({ label, title, description, items }: ListingPageProps) {
  return (
    <div className="section-padding pb-32">
      <div className="content-grid">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
          {label}
        </p>
        <h1 className="mt-4 max-w-4xl text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.95] tracking-[-0.03em]">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#F1E9DB]/65">
          {description}
        </p>

        <div className="mt-14 divide-y divide-white/10 border-y border-white/10">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group grid gap-8 py-10 transition-colors hover:bg-white/[0.02] md:grid-cols-12 md:items-center md:py-12"
            >
              {item.image && (
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 md:col-span-4">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}
              <div className={item.image ? 'md:col-span-7' : 'md:col-span-11'}>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#d4af37]">
                  {item.category}
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-[#F1E9DB] transition-colors group-hover:text-[#d4af37] md:text-3xl">
                  {item.title}
                </h2>
                <p className="mt-4 max-w-2xl leading-relaxed text-[#F1E9DB]/60">
                  {item.description}
                </p>
                {item.meta && (
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#F1E9DB]/40">
                    {item.meta}
                  </p>
                )}
              </div>
              <div className="flex md:col-span-1 md:justify-end">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-[#F1E9DB]/40 transition-all group-hover:border-[#d4af37]/50 group-hover:text-[#d4af37]">
                  <ArrowUpRight size={18} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
