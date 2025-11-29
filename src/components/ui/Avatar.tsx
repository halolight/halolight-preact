import type { ComponentChildren, JSX } from 'preact'
import { cn } from '../../lib/utils'

export interface AvatarProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children?: ComponentChildren
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeStyles = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg'
}

export function Avatar({ className, children, size = 'md', ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full',
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface AvatarImageProps extends JSX.HTMLAttributes<HTMLImageElement> {
  src?: string
  alt?: string
}

export function AvatarImage({ className, src, alt, ...props }: AvatarImageProps) {
  if (!src) return null

  return (
    <img
      className={cn('aspect-square h-full w-full object-cover', className)}
      src={src}
      alt={alt}
      {...props}
    />
  )
}

export interface AvatarFallbackProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children?: ComponentChildren
}

export function AvatarFallback({ className, children, ...props }: AvatarFallbackProps) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Avatar