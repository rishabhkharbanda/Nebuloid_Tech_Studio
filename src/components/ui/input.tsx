import * as React from 'react'
import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-14 w-full rounded-2xl border border-[#F1E9DB]/15 bg-white/5 px-5 py-3 text-base text-[#F1E9DB] placeholder:text-[#F1E9DB]/40 outline-none backdrop-blur-sm transition-colors focus:border-[#d4af37]/60',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
