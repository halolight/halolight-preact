import type { JSX } from 'preact'
import { forwardRef } from 'preact/compat'
import { cn } from '../../lib/utils'

export interface InputProps {
  type?: string
  error?: string
  placeholder?: string
  value?: string | number
  defaultValue?: string | number
  id?: string
  name?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  autoFocus?: boolean
  autoComplete?: string
  min?: string | number
  max?: string | number
  step?: string | number
  pattern?: string
  class?: string
  className?: string
  onInput?: (e: JSX.TargetedInputEvent<HTMLInputElement>) => void
  onChange?: (e: JSX.TargetedInputEvent<HTMLInputElement>) => void
  onFocus?: (e: JSX.TargetedFocusEvent<HTMLInputElement>) => void
  onBlur?: (e: JSX.TargetedFocusEvent<HTMLInputElement>) => void
  onKeyDown?: (e: JSX.TargetedKeyboardEvent<HTMLInputElement>) => void
  onKeyUp?: (e: JSX.TargetedKeyboardEvent<HTMLInputElement>) => void
  onKeyPress?: (e: JSX.TargetedKeyboardEvent<HTMLInputElement>) => void
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, class: classNameProp, type = 'text', error, ...props }, ref) => {
    return (
      <div class="w-full">
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
            'ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:ring-destructive',
            className,
            classNameProp
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p class="mt-1 text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
