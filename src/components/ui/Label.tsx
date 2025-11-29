import type { ComponentChildren } from 'preact'
import { cn } from '../../lib/utils'

export interface LabelProps {
  children?: ComponentChildren
  required?: boolean
  htmlFor?: string
  class?: string
  className?: string
  id?: string
}

export function Label({ className, class: classNameProp, children, required, htmlFor, ...props }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
        classNameProp
      )}
      {...props}
    >
      {children}
      {required && <span class="ml-1 text-destructive">*</span>}
    </label>
  )
}

export default Label
