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
    <span className={cn('relative inline-flex shrink-0 items-center', className)}>
      <Image
        src={DARK_LOGO}
        alt="Nebuloid Tech Studio"
        width={56}
        height={56}
        priority={priority}
        className={cn(
          'h-10 w-10 object-contain transition-opacity duration-300 md:h-12 md:w-12',
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
          'absolute inset-0 h-10 w-10 object-contain transition-opacity duration-300 md:h-12 md:w-12',
          isDay ? 'opacity-100' : 'opacity-0',
        )}
      />
    </span>
  )
}
