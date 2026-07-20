'use client'

import Image from 'next/image'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'

const DARK_LOGO = '/assets/nebuloid-logo-mark.png'
const DAY_LOGO = '/assets/nebuloid-logo-mark-day.png'

export function BrandLogo({
  className,
  priority = false,
}: {
  className?: string
  priority?: boolean
}) {
  const theme = useTheme()
  const isDay = theme === 'day'

  return (
    <span
      className={cn(
        'relative inline-flex h-10 w-10 shrink-0 items-center justify-center md:h-12 md:w-12',
        className,
      )}
    >
      <Image
        src={DARK_LOGO}
        alt="Nebuloid Tech Studio"
        width={56}
        height={56}
        priority={priority}
        className={cn(
          'h-full w-full object-contain transition-opacity duration-300',
          isDay ? 'opacity-0' : 'opacity-100',
        )}
      />
      <Image
        src={DAY_LOGO}
        alt=""
        aria-hidden
        width={56}
        height={56}
        priority={priority}
        className={cn(
          'absolute inset-0 h-full w-full object-contain transition-opacity duration-300',
          isDay ? 'opacity-100' : 'opacity-0',
        )}
      />
    </span>
  )
}
