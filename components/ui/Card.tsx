import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = 'md', shadow = 'md', children, ...props }, ref) => {
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    }
    
    const shadows = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'bg-white rounded-lg border border-gray-200',
          paddings[padding],
          shadows[shadow],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
