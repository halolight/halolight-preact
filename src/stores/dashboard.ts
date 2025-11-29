import { signal } from "@preact/signals"
import { getLocalStorageItem, setLocalStorageItem, generateId } from "../lib/utils"
import type { DashboardWidget, DashboardLayout, WidgetType } from "../types"

// 仪表盘部件类型定义
const WIDGET_TYPES: WidgetType[] = [
  'stats',
  'chart-line',
  'chart-bar',
  'chart-pie',
  'recent-users',
  'notifications',
  'tasks',
  'calendar',
  'quick-actions'
]

// 默认布局配置
const DEFAULT_LAYOUTS: DashboardLayout[] = [
  { i: 'stats', x: 0, y: 0, w: 12, h: 2, minW: 6, minH: 2 },
  { i: 'chart-line', x: 0, y: 2, w: 8, h: 4, minW: 4, minH: 3 },
  { i: 'chart-pie', x: 8, y: 2, w: 4, h: 4, minW: 3, minH: 3 },
  { i: 'recent-users', x: 0, y: 6, w: 6, h: 3, minW: 3, minH: 2 },
  { i: 'notifications', x: 6, y: 6, w: 6, h: 3, minW: 3, minH: 2 }
]

// 默认部件配置
const DEFAULT_WIDGETS: DashboardWidget[] = [
  { id: 'stats', type: 'stats', title: '统计数据' },
  { id: 'chart-line', type: 'chart-line', title: '访问趋势' },
  { id: 'chart-pie', type: 'chart-pie', title: '流量来源' },
  { id: 'recent-users', type: 'recent-users', title: '最近用户' },
  { id: 'notifications', type: 'notifications', title: '最新通知' }
]

// 仪表盘状态信号
export const widgets = signal<DashboardWidget[]>(getLocalStorageItem('halolight-dashboard-widgets', DEFAULT_WIDGETS))
export const layouts = signal<DashboardLayout[]>(getLocalStorageItem('halolight-dashboard-layouts', DEFAULT_LAYOUTS))
export const isEditing = signal<boolean>(false)
export const availableWidgetTypes = signal<WidgetType[]>(WIDGET_TYPES)

/**
 * 添加部件
 */
export function addWidget(type: WidgetType, title?: string, config?: Record<string, unknown>): void {
  const id = generateId()
  const widgetTitle = title || getWidgetDefaultTitle(type)

  const newWidget: DashboardWidget = {
    id,
    type,
    title: widgetTitle,
    config
  }

  // 计算新部件的位置
  const maxY = Math.max(...layouts.value.map(l => l.y + l.h), 0)
  const newLayout: DashboardLayout = {
    i: id,
    x: 0,
    y: maxY,
    w: getWidgetDefaultWidth(type),
    h: getWidgetDefaultHeight(type),
    minW: getWidgetMinWidth(type),
    minH: getWidgetMinHeight(type)
  }

  widgets.value = [...widgets.value, newWidget]
  layouts.value = [...layouts.value, newLayout]

  saveDashboardConfig()
}

/**
 * 移除部件
 */
export function removeWidget(id: string): void {
  widgets.value = widgets.value.filter(w => w.id !== id)
  layouts.value = layouts.value.filter(l => l.i !== id)
  saveDashboardConfig()
}

/**
 * 更新部件标题
 */
export function updateWidgetTitle(id: string, title: string): void {
  widgets.value = widgets.value.map(w =>
    w.id === id ? { ...w, title } : w
  )
  saveDashboardConfig()
}

/**
 * 更新部件配置
 */
export function updateWidgetConfig(id: string, config: Record<string, unknown>): void {
  widgets.value = widgets.value.map(w =>
    w.id === id ? { ...w, config: { ...w.config, ...config } } : w
  )
  saveDashboardConfig()
}

/**
 * 设置布局
 */
export function setLayouts(newLayouts: DashboardLayout[]): void {
  layouts.value = newLayouts
  saveDashboardConfig()
}

/**
 * 获取指定部件的布局
 */
export function getLayoutForWidget(id: string): DashboardLayout | undefined {
  return layouts.value.find(l => l.i === id)
}

/**
 * 重置为默认配置
 */
export function resetToDefault(): void {
  widgets.value = [...DEFAULT_WIDGETS]
  layouts.value = [...DEFAULT_LAYOUTS]
  isEditing.value = false
  saveDashboardConfig()
}

/**
 * 切换编辑模式
 */
export function toggleEditing(): void {
  isEditing.value = !isEditing.value
}

/**
 * 保存仪表盘配置
 */
export function saveDashboardConfig(): void {
  setLocalStorageItem('halolight-dashboard-widgets', widgets.value)
  setLocalStorageItem('halolight-dashboard-layouts', layouts.value)
}

/**
 * 获取部件默认标题
 */
function getWidgetDefaultTitle(type: WidgetType): string {
  const titles: Record<WidgetType, string> = {
    'stats': '统计数据',
    'chart-line': '折线图',
    'chart-bar': '柱状图',
    'chart-pie': '饼图',
    'recent-users': '最近用户',
    'notifications': '通知',
    'tasks': '任务',
    'calendar': '日历',
    'quick-actions': '快捷操作'
  }
  return titles[type]
}

/**
 * 获取部件默认宽度
 */
function getWidgetDefaultWidth(type: WidgetType): number {
  const widths: Record<WidgetType, number> = {
    'stats': 12,
    'chart-line': 8,
    'chart-bar': 8,
    'chart-pie': 4,
    'recent-users': 6,
    'notifications': 6,
    'tasks': 4,
    'calendar': 6,
    'quick-actions': 3
  }
  return widths[type]
}

/**
 * 获取部件默认高度
 */
function getWidgetDefaultHeight(type: WidgetType): number {
  const heights: Record<WidgetType, number> = {
    'stats': 2,
    'chart-line': 4,
    'chart-bar': 4,
    'chart-pie': 4,
    'recent-users': 3,
    'notifications': 3,
    'tasks': 3,
    'calendar': 4,
    'quick-actions': 2
  }
  return heights[type]
}

/**
 * 获取部件最小宽度
 */
function getWidgetMinWidth(type: WidgetType): number {
  const minWidths: Record<WidgetType, number> = {
    'stats': 6,
    'chart-line': 4,
    'chart-bar': 4,
    'chart-pie': 3,
    'recent-users': 3,
    'notifications': 3,
    'tasks': 3,
    'calendar': 4,
    'quick-actions': 2
  }
  return minWidths[type]
}

/**
 * 获取部件最小高度
 */
function getWidgetMinHeight(type: WidgetType): number {
  const minHeights: Record<WidgetType, number> = {
    'stats': 2,
    'chart-line': 3,
    'chart-bar': 3,
    'chart-pie': 3,
    'recent-users': 2,
    'notifications': 2,
    'tasks': 2,
    'calendar': 3,
    'quick-actions': 2
  }
  return minHeights[type]
}

/**
 * 初始化仪表盘配置
 */
export function initDashboard(): void {
  // 如果没有保存的配置，使用默认配置
  if (widgets.value.length === 0) {
    widgets.value = [...DEFAULT_WIDGETS]
  }
  if (layouts.value.length === 0) {
    layouts.value = [...DEFAULT_LAYOUTS]
  }
}

/**
 * 清理仪表盘状态
 */
export function cleanupDashboard(): void {
  isEditing.value = false
}

/**
 * 获取可用部件类型
 */
export function getAvailableWidgetTypes(): WidgetType[] {
  return [...WIDGET_TYPES]
}

/**
 * 检查部件类型是否可用
 */
export function isWidgetTypeAvailable(type: WidgetType): boolean {
  return !widgets.value.some(w => w.type === type)
}

/**
 * 获取已使用的部件类型
 */
export function getUsedWidgetTypes(): WidgetType[] {
  return widgets.value.map(w => w.type)
}

/**
 * 获取未使用的部件类型
 */
export function getUnusedWidgetTypes(): WidgetType[] {
  const usedTypes = getUsedWidgetTypes()
  return WIDGET_TYPES.filter(type => !usedTypes.includes(type))
}