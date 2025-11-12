import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number // 0-100
  label?: string
  showPercentage?: boolean
  color?: 'primary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
}

export const ProgressBar = ({
  value,
  label,
  showPercentage = true,
  color = 'primary',
  size = 'md',
  className,
  ...props
}: ProgressBarProps) => {
  const clampedValue = Math.min(Math.max(value, 0), 100)
  
  const colors = {
    primary: 'bg-primary-600',
    success: 'bg-success-600',
    warning: 'bg-warning-600',
    error: 'bg-error-600'
  }
  
  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }

  return (
    <div className={cn('w-full', className)} {...props}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-600">{clampedValue}%</span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', colors[color])}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  )
}
