'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/60',
  {
    variants: {
      variant: {
        default:
          'bg-[#F1E9DB] text-[#090909] hover:bg-[#d4af37] hover:text-[#090909]',
        outline:
          'border border-[#F1E9DB]/35 bg-transparent text-[#F1E9DB] hover:border-[#d4af37]/60 hover:bg-[#F1E9DB]/10',
        ghost: 'bg-transparent text-[#F1E9DB] hover:bg-[#F1E9DB]/10',
      },
      size: {
        default: 'h-12 px-6',
        lg: 'h-14 px-9 text-base',
        icon: 'h-12 w-12 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
