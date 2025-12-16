import type { ComponentChildren } from 'preact'
import { signal } from '@preact/signals'
import { useEffect, useCallback } from 'preact/hooks'
import { getCurrentUrl } from 'preact-router'

// 获取当前路径
function useCurrentPath() {
  return getCurrentUrl()
}

// 页面状态缓存
interface PageState {
  scrollY: number
  formData?: Record<string, unknown>
  customState?: Record<string, unknown>
  timestamp: number
}

// 缓存存储
const pageCache = signal<Map<string, PageState>>(new Map())

/**
 * 设置页面状态
 */
export function setPageState(path: string, state: Partial<PageState>): void {
  const cache = new Map(pageCache.value)
  const existing = cache.get(path) || { scrollY: 0, timestamp: Date.now() }
  cache.set(path, { ...existing, ...state, timestamp: Date.now() })
  pageCache.value = cache
}

/**
 * 获取页面状态
 */
export function getPageState(path: string): PageState | undefined {
  return pageCache.value.get(path)
}

/**
 * 清除页面状态
 */
export function clearPageState(path: string): void {
  const cache = new Map(pageCache.value)
  cache.delete(path)
  pageCache.value = cache
}

/**
 * 清除所有缓存
 */
export function clearAllCache(): void {
  pageCache.value = new Map()
}

/**
 * Hook: 自动保存和恢复滚动位置
 */
export function useScrollRestore() {
  const pathname = useCurrentPath()

  useEffect(() => {
    let isRestoring = false

    // 保存滚动位置
    const handleScroll = () => {
      if (!isRestoring) {
        setPageState(pathname, { scrollY: window.scrollY })
      }
    }

    // 使用节流
    let timeoutId: ReturnType<typeof setTimeout>
    const throttledScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleScroll, 100)
    }

    window.addEventListener('scroll', throttledScroll)

    // 恢复滚动位置
    const pageState = getPageState(pathname)
    if (pageState && pageState.scrollY > 0) {
      isRestoring = true
      // 等待页面渲染完成
      requestAnimationFrame(() => {
        window.scrollTo(0, pageState.scrollY)
        // 延迟重置标志，避免立即触发保存
        setTimeout(() => {
          isRestoring = false
        }, 100)
      })
    }

    return () => {
      window.removeEventListener('scroll', throttledScroll)
      clearTimeout(timeoutId)
    }
  }, [pathname])
}

/**
 * Hook: 保存和恢复表单状态
 */
export function useFormCache<T extends Record<string, unknown>>(
  formKey: string,
  initialValues: T
): [T, (values: T) => void, () => void] {
  const pathname = useCurrentPath()
  const cacheKey = `${pathname}:${formKey}`

  // 从缓存获取初始值
  const getCachedValues = useCallback((): T => {
    const pageState = getPageState(cacheKey)
    if (pageState?.formData) {
      return pageState.formData as T
    }
    return initialValues
  }, [cacheKey, initialValues])

  const [values, setValuesSignal] = [
    signal<T>(getCachedValues()),
    (newValues: T) => {
      signal<T>(newValues)
      setPageState(cacheKey, { formData: newValues })
    }
  ]

  // 保存表单值到缓存
  const saveValues = useCallback(
    (newValues: T) => {
      setValuesSignal(newValues)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cacheKey]
  )

  // 清除缓存
  const clearCache = useCallback(() => {
    setValuesSignal(initialValues)
    clearPageState(cacheKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, initialValues])

  return [values as unknown as T, saveValues, clearCache]
}

/**
 * Hook: 保存和恢复自定义状态
 */
export function useStateCache<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const pathname = useCurrentPath()
  const cacheKey = `${pathname}:${key}`

  // 从缓存获取初始值
  const getCachedValue = useCallback((): T => {
    const pageState = getPageState(cacheKey)
    if (pageState?.customState?.[key] !== undefined) {
      return pageState.customState[key] as T
    }
    return initialValue
  }, [cacheKey, key, initialValue])

  const valueSignal = signal<T>(getCachedValue())

  // 同步到缓存
  const setValue = useCallback(
    (newValue: T) => {
      valueSignal.value = newValue
      const pageState = getPageState(cacheKey) || { scrollY: 0, timestamp: Date.now() }
      setPageState(cacheKey, {
        customState: { ...pageState.customState, [key]: newValue },
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cacheKey, key]
  )

  return [valueSignal.value, setValue]
}

/**
 * KeepAlive 组件包装器
 */
interface KeepAliveWrapperProps {
  children: ComponentChildren
}

export function KeepAliveWrapper({ children }: KeepAliveWrapperProps) {
  useScrollRestore()
  return children
}
