import type { ComponentChildren, JSX } from 'preact'
import { cn } from '../../lib/utils'

export interface SkeletonProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children?: ComponentChildren
}

export function Skeleton({ className, children, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default Skeleton