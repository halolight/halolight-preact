import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/preact'
import { Button } from './Button'

describe('Button', () => {
  it('渲染默认按钮', () => {
    render(<Button>点击</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('点击')
  })

  it('渲染不同变体的按钮', () => {
    const { rerender } = render(<Button variant="default">默认</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-primary')

    rerender(<Button variant="destructive">删除</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-destructive')

    rerender(<Button variant="outline">边框</Button>)
    expect(screen.getByRole('button')).toHaveClass('border')

    rerender(<Button variant="ghost">幽灵</Button>)
    expect(screen.getByRole('button')).toHaveClass('hover:bg-accent')
  })

  it('渲染不同尺寸的按钮', () => {
    const { rerender } = render(<Button size="default">默认</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-10')

    rerender(<Button size="sm">小</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-9')

    rerender(<Button size="lg">大</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-11')
  })

  it('禁用状态下无法点击', () => {
    render(<Button disabled>禁用</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('应用自定义类名', () => {
    render(<Button class="custom-class">自定义</Button>)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })
})
