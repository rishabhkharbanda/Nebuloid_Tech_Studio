import * as React from 'react'
import { cn } from '@/lib/utils'

function Select({ className, children, ...props }: React.ComponentProps<'select'>) {
  return (
    <select
      data-slot="select"
      className={cn(
        'flex h-14 w-full appearance-none rounded-2xl border border-[#F1E9DB]/15 bg-white/5 bg-[length:14px] bg-[position:right_1.25rem_center] bg-no-repeat px-5 py-3 pr-12 text-base text-[#F1E9DB] outline-none backdrop-blur-sm transition-colors focus:border-[#d4af37]/60',
        'bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2714%27 height=%2714%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23F1E9DB%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E")]',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}

export { Select }
