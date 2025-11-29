import { signal, computed } from "@preact/signals"
import { getLocalStorageItem, setLocalStorageItem, supportsViewTransitions, prefersReducedMotion } from "../lib/utils"

// 布局状态信号
export const sidebarCollapsed = signal<boolean>(getLocalStorageItem('halolight-sidebar-collapsed', false))
export const mobileSidebarOpen = signal<boolean>(false)
export const theme = signal<'light' | 'dark' | 'system'>(getLocalStorageItem('halolight-theme', 'system'))
export const showFooter = signal<boolean>(getLocalStorageItem('halolight-show-footer', true))

// 计算信号
export const resolvedTheme = computed(() => {
  if (theme.value === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme.value
})

export const isDark = computed(() => resolvedTheme.value === 'dark')

/**
 * 切换侧边栏折叠状态
 */
export function toggleSidebar(): void {
  sidebarCollapsed.value = !sidebarCollapsed.value
  setLocalStorageItem('halolight-sidebar-collapsed', sidebarCollapsed.value)
}

/**
 * 设置主题
 */
export function setTheme(newTheme: 'light' | 'dark' | 'system'): void {
  theme.value = newTheme
  setLocalStorageItem('halolight-theme', newTheme)
  applyTheme()
}

/**
 * 切换主题
 */
export function toggleTheme(): void {
  const nextTheme = isDark.value ? 'light' : 'dark'
  setTheme(nextTheme)
}

/**
 * 设置主题（带过渡动画）
 */
export function setThemeWithTransition(newTheme: 'light' | 'dark' | 'system', event?: MouseEvent): void {
  if (!supportsViewTransitions() || prefersReducedMotion()) {
    setTheme(newTheme)
    return
  }

  const transition = (document as unknown as { startViewTransition: (callback: () => void) => { ready: Promise<void> } }).startViewTransition(() => {
    setTheme(newTheme)
  })

  if (event) {
    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ]

      document.documentElement.animate(
        {
          clipPath: newTheme === 'dark' ? clipPath : [...clipPath].reverse()
        },
        {
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement: newTheme === 'dark'
            ? '::view-transition-new(root)'
            : '::view-transition-old(root)'
        }
      )
    })
  }
}

/**
 * 切换主题（带过渡动画）
 */
export function toggleThemeWithTransition(event?: MouseEvent): void {
  const nextTheme = isDark.value ? 'light' : 'dark'
  setThemeWithTransition(nextTheme, event)
}

/**
 * 应用主题到 DOM
 */
export function applyTheme(): void {
  const currentTheme = resolvedTheme.value

  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

/**
 * 初始化主题
 */
export function initTheme(): void {
  applyTheme()

  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', () => {
    if (theme.value === 'system') {
      applyTheme()
    }
  })
}

/**
 * 切换移动端侧边栏
 */
export function toggleMobileSidebar(): void {
  mobileSidebarOpen.value = !mobileSidebarOpen.value
}

/**
 * 关闭移动端侧边栏
 */
export function closeMobileSidebar(): void {
  mobileSidebarOpen.value = false
}

/**
 * 切换页脚显示
 */
export function toggleFooter(): void {
  showFooter.value = !showFooter.value
  setLocalStorageItem('halolight-show-footer', showFooter.value)
}

/**
 * 初始化布局状态
 */
export function initLayout(): void {
  initTheme()
  // 监听窗口大小变化，重置移动端侧边栏状态
  const handleResize = () => {
    if (window.innerWidth >= 768) {
      mobileSidebarOpen.value = false
    }
  }
  window.addEventListener('resize', handleResize)
  handleResize() // 初始检查
}

/**
 * 清理布局监听器
 */
export function cleanupLayout(): void {
  window.removeEventListener('resize', () => {})
}