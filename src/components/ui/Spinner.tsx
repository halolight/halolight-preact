import type { ComponentChildren, JSX } from 'preact'
import { cn } from '../../lib/utils'

export interface SpinnerProps extends JSX.HTMLAttributes<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg'
}

const sizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8'
}

export function Spinner({ className, size = 'md', ...props }: SpinnerProps) {
  return (
    <svg
      className={cn('animate-spin text-primary', sizeStyles[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

export interface LoadingProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children?: ComponentChildren
  text?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Loading({ className, text = '加载中...', size = 'md', ...props }: LoadingProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-2', className)}
      {...props}
    >
      <Spinner size={size} />
      {text && <span class="text-sm text-muted-foreground">{text}</span>}
    </div>
  )
}

export default Spinner