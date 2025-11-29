import type { JSX } from 'preact'
import { useState } from 'preact/hooks'
import { cn } from '../../lib/utils'

export interface SwitchProps extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
}

export function Switch({
  className,
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  ...props
}: SwitchProps) {
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
      role="switch"
      aria-checked={isChecked}
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50',
        isChecked ? 'bg-primary' : 'bg-input',
        className
      )}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      <span
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform',
          isChecked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  )
}

export default Switch