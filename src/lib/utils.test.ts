import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn (classnames utility)', () => {
  it('合并多个类名', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c')
  })

  it('处理条件类名', () => {
    const shouldShowActive = true
    const shouldShowInactive = false
    expect(cn('base', shouldShowActive && 'active', shouldShowInactive && 'inactive')).toBe('base active')
  })

  it('处理 undefined 和 null', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end')
  })

  it('合并 Tailwind 类名并去重', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('处理空输入', () => {
    expect(cn()).toBe('')
  })

  it('处理对象形式的条件类名', () => {
    expect(cn({ active: true, disabled: false })).toBe('active')
  })

  it('处理数组形式的类名', () => {
    expect(cn(['a', 'b'], 'c')).toBe('a b c')
  })
})
