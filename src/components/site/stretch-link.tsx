import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Full-card hit target with short, SEO-friendly anchor text.
 * Place inside a `relative` card; keep visible copy outside this link.
 */
export function StretchLink({
  href,
  label,
  className,
}: {
  href: string
  label: string
  className?: string
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        'absolute inset-0 z-10 rounded-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909]',
        className,
      )}
    >
      <span className="sr-only">{label}</span>
    </Link>
  )
}
