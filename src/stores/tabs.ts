import { signal, computed } from '@preact/signals'
import { setLocalStorageItem, getLocalStorageItem } from '../lib/utils'

export interface Tab {
  id: string
  title: string
  path: string
  icon?: string
  closable?: boolean
}

interface TabsState {
  tabs: Tab[]
  activeTabId: string | null
}

// 首页标签
const homeTab: Tab = {
  id: 'home',
  title: '首页',
  path: '/',
  closable: false,
}

// 从 localStorage 加载初始状态
const loadInitialState = (): TabsState => {
  const stored = getLocalStorageItem<TabsState>('halolight-tabs', {
    tabs: [homeTab],
    activeTabId: 'home',
  })
  return stored
}

// 标签状态信号
const tabsState = signal<TabsState>(loadInitialState())

// 计算信号
export const tabs = computed(() => tabsState.value.tabs)
export const activeTabId = computed(() => tabsState.value.activeTabId)

// 持久化到 localStorage
function persistState() {
  setLocalStorageItem('halolight-tabs', tabsState.value)
}

/**
 * 添加标签
 */
export function addTab(tab: Omit<Tab, 'id'>): string {
  const currentTabs = tabsState.value.tabs

  // 检查是否已存在相同路径的标签
  const existingTab = currentTabs.find((t) => t.path === tab.path)
  if (existingTab) {
    tabsState.value = {
      ...tabsState.value,
      activeTabId: existingTab.id,
    }
    persistState()
    return existingTab.id
  }

  const newTab: Tab = {
    ...tab,
    id: `tab-${Date.now()}`,
    closable: tab.closable !== false,
  }

  tabsState.value = {
    tabs: [...currentTabs, newTab],
    activeTabId: newTab.id,
  }
  persistState()

  return newTab.id
}

/**
 * 删除标签
 */
export function removeTab(id: string): void {
  const currentState = tabsState.value
  const currentTabs = currentState.tabs

  const tabToRemove = currentTabs.find((t) => t.id === id)
  if (!tabToRemove || tabToRemove.closable === false) return

  const newTabs = currentTabs.filter((t) => t.id !== id)
  let newActiveId = currentState.activeTabId

  // 如果关闭的是当前活动标签，切换到相邻标签
  if (currentState.activeTabId === id) {
    const closedIndex = currentTabs.findIndex((t) => t.id === id)
    if (closedIndex > 0) {
      newActiveId = newTabs[closedIndex - 1]?.id || newTabs[0]?.id
    } else {
      newActiveId = newTabs[0]?.id
    }
  }

  tabsState.value = {
    tabs: newTabs,
    activeTabId: newActiveId,
  }
  persistState()
}

/**
 * 设置活动标签
 */
export function setActiveTab(id: string): void {
  const currentTabs = tabsState.value.tabs
  if (currentTabs.some((t) => t.id === id)) {
    tabsState.value = {
      ...tabsState.value,
      activeTabId: id,
    }
    persistState()
  }
}

/**
 * 更新标签
 */
export function updateTab(id: string, updates: Partial<Tab>): void {
  const currentTabs = tabsState.value.tabs
  tabsState.value = {
    ...tabsState.value,
    tabs: currentTabs.map((t) => (t.id === id ? { ...t, ...updates } : t)),
  }
  persistState()
}

/**
 * 清除所有标签（保留首页）
 */
export function clearTabs(): void {
  tabsState.value = {
    tabs: [homeTab],
    activeTabId: 'home',
  }
  persistState()
}

/**
 * 获取标签
 */
export function getTab(id: string): Tab | undefined {
  return tabsState.value.tabs.find((t) => t.id === id)
}

/**
 * 根据路径获取标签
 */
export function getTabByPath(path: string): Tab | undefined {
  return tabsState.value.tabs.find((t) => t.path === path)
}

/**
 * 关闭其他标签
 */
export function closeOtherTabs(id: string): void {
  const currentTabs = tabsState.value.tabs
  const targetTab = currentTabs.find((t) => t.id === id)
  if (!targetTab) return

  const newTabs = currentTabs.filter((t) => t.id === id || t.closable === false)

  tabsState.value = {
    tabs: newTabs,
    activeTabId: id,
  }
  persistState()
}

/**
 * 关闭右侧标签
 */
export function closeRightTabs(id: string): void {
  const currentTabs = tabsState.value.tabs
  const tabIndex = currentTabs.findIndex((t) => t.id === id)
  if (tabIndex === -1) return

  const rightTabs = currentTabs.slice(tabIndex + 1).filter((t) => t.closable !== false)
  const newTabs = currentTabs.filter((t) => !rightTabs.includes(t))

  tabsState.value = {
    ...tabsState.value,
    tabs: newTabs,
  }
  persistState()
}

/**
 * 初始化标签状态
 */
export function initTabs(): void {
  const stored = loadInitialState()
  tabsState.value = stored
}
