import type { JSX } from 'preact'
import { useState } from 'preact/hooks'
import { cn } from '../../lib/utils'

export interface CheckboxProps extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
}

export function Checkbox({
  className,
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  ...props
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked)

  const isControlled = controlledChecked !== undefined
  const isChecked = isControlled ? controlledChecked : internalChecked

  const handleClick = () => {
    if (disabled) return

    const newValue = !isChecked

    if (!isControlled) {
      setInternalChecked(newValue)
    }

    onChange?.(newValue)
  }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isChecked}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        isChecked && 'bg-primary text-primary-foreground',
        className
      )}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {isChecked && (
        <svg
          class="h-full w-full"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  )
}

export default Checkbox