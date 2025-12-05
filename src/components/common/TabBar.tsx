import { useEffect, useRef, useState, useCallback } from 'preact/hooks'
import { route, getCurrentUrl } from 'preact-router'
import { ChevronLeft, ChevronRight, X, Home, Users, Settings, FileText, type LucideIcon } from 'lucide-preact'
import {
  tabs,
  activeTabId,
  addTab,
  removeTab,
  setActiveTab,
  clearTabs,
  getTabByPath,
  updateTab,
  closeOtherTabs,
  closeRightTabs,
  type Tab
} from '../../stores/tabs'
import { Button } from '../ui/Button'

// 自定义 hook 获取当前路径
function useCurrentPath() {
  const [path, setPath] = useState(getCurrentUrl())

  useEffect(() => {
    const handleRoute = () => {
      setPath(getCurrentUrl())
    }
    window.addEventListener('popstate', handleRoute)
    return () => window.removeEventListener('popstate', handleRoute)
  }, [])

  return path
}

// 路径到标题的映射
const pathTitles: Record<string, string> = {
  '/': '首页',
  '/users': '用户管理',
  '/accounts': '账号与权限',
  '/analytics': '数据分析',
  '/settings': '系统设置',
  '/documents': '文档管理',
  '/files': '文件管理',
  '/messages': '消息中心',
  '/calendar': '日程管理',
  '/notifications': '通知中心',
  '/profile': '个人资料',
  '/docs': '帮助文档',
}

// 路径到图标的映射
const pathIcons: Record<string, LucideIcon> = {
  '/': Home,
  '/users': Users,
  '/settings': Settings,
  '/documents': FileText,
}

const resolveTitle = (path: string): string => {
  const match = Object.entries(pathTitles).find(
    ([key]) => path === key || path.startsWith(`${key}/`)
  )
  return match ? match[1] : path.split('/').pop() || '新页面'
}

const resolveIcon = (path: string): LucideIcon => {
  const match = Object.entries(pathIcons).find(
    ([key]) => path === key || path.startsWith(`${key}/`)
  )
  return match ? match[1] : Home
}

interface ContextMenuState {
  show: boolean
  x: number
  y: number
  tab: Tab | null
}

export function TabBar() {
  const currentPath = useCurrentPath()
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    show: false,
    x: 0,
    y: 0,
    tab: null,
  })

  // 检查滚动状态
  const checkScroll = useCallback(() => {
    const container = tabsContainerRef.current
    if (!container) return

    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    )
  }, [])

  // 滚动到活动标签
  const scrollToActiveTab = useCallback(() => {
    const container = tabsContainerRef.current
    if (!container || !activeTabId.value) return

    const activeTab = container.querySelector(`[data-tab-id="${activeTabId.value}"]`)
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [])

  // 监听路由变化，自动添加标签
  useEffect(() => {
    if (currentPath) {
      const existingTab = getTabByPath(currentPath)
      const title = resolveTitle(currentPath)
      if (existingTab) {
        setActiveTab(existingTab.id)
        if (existingTab.title !== title) {
          updateTab(existingTab.id, { title })
        }
      } else {
        addTab({ title, path: currentPath, icon: resolveIcon(currentPath).displayName })
      }
    }
  }, [currentPath])

  // 监听标签变化，检查滚动
  useEffect(() => {
    checkScroll()
    scrollToActiveTab()
  }, [checkScroll, scrollToActiveTab])

  // 监听容器大小变化
  useEffect(() => {
    const container = tabsContainerRef.current
    if (!container) return

    const observer = new ResizeObserver(checkScroll)
    observer.observe(container)

    container.addEventListener('scroll', checkScroll)

    return () => {
      observer.disconnect()
      container.removeEventListener('scroll', checkScroll)
    }
  }, [checkScroll])

  // 关闭右键菜单
  useEffect(() => {
    const handleClick = () => setContextMenu({ show: false, x: 0, y: 0, tab: null })
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    const container = tabsContainerRef.current
    if (!container) return

    const scrollAmount = 200
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab.id)
    if (currentPath !== tab.path) {
      route(tab.path)
    }
  }

  const handleCloseTab = (e: MouseEvent, tab: Tab) => {
    e.stopPropagation()
    if (tab.closable === false) return

    const currentIndex = tabs.value.findIndex((t) => t.id === tab.id)
    removeTab(tab.id)

    // 如果关闭的是当前标签，跳转到相邻标签
    if (tab.id === activeTabId.value) {
      const nextTab = tabs.value[currentIndex + 1] || tabs.value[currentIndex - 1]
      if (nextTab) {
        route(nextTab.path)
      }
    }
  }

  const handleContextMenu = (e: MouseEvent, tab: Tab) => {
    e.preventDefault()
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      tab,
    })
  }

  const handleCloseOthers = () => {
    if (contextMenu.tab) {
      closeOtherTabs(contextMenu.tab.id)
      route(contextMenu.tab.path)
    }
  }

  const handleCloseRight = () => {
    if (contextMenu.tab) {
      closeRightTabs(contextMenu.tab.id)
    }
  }

  const handleCloseAll = () => {
    clearTabs()
    route('/')
  }

  if (tabs.value.length <= 1) return null

  return (
    <div class="flex h-12 items-center border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative z-40">
      {/* 左滚动按钮 */}
      {canScrollLeft && (
        <Button
          variant="ghost"
          size="icon"
          class="h-8 w-8 shrink-0"
          onClick={() => scroll('left')}
        >
          <ChevronLeft class="h-4 w-4" />
        </Button>
      )}

      {/* 标签容器 */}
      <div
        ref={tabsContainerRef}
        class="flex-1 flex items-center overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tabs.value.map((tab) => {
          const Icon = pathIcons[tab.path] || Home
          return (
            <div
              key={tab.id}
              data-tab-id={tab.id}
              class={`group flex items-center gap-1 px-3 py-2 border-r border-border cursor-pointer transition-colors relative min-w-[100px] max-w-[200px] ${
                activeTabId.value === tab.id
                  ? 'bg-background text-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
              onClick={() => handleTabClick(tab)}
              onContextMenu={(e) => handleContextMenu(e as unknown as MouseEvent, tab)}
            >
              {/* 活动指示器 */}
              {activeTabId.value === tab.id && (
                <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}

              {/* 图标 */}
              {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}

              {/* 标题 */}
              <span class="truncate text-sm">{tab.title}</span>

              {/* 关闭按钮 */}
              {tab.closable !== false && (
                <button
                  class={`h-4 w-4 p-0 transition-opacity ml-1 shrink-0 hover:bg-muted-foreground/20 rounded-sm flex items-center justify-center ${
                    activeTabId.value === tab.id
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                  }`}
                  onClick={(e) => handleCloseTab(e as unknown as MouseEvent, tab)}
                >
                  <X class="h-3 w-3" />
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* 右滚动按钮 */}
      {canScrollRight && (
        <Button
          variant="ghost"
          size="icon"
          class="h-8 w-8 shrink-0"
          onClick={() => scroll('right')}
        >
          <ChevronRight class="h-4 w-4" />
        </Button>
      )}

      {/* 右键菜单 */}
      {contextMenu.show && contextMenu.tab && (
        <div
          class="fixed bg-popover text-popover-foreground rounded-md shadow-lg border border-border py-1 z-50 min-w-[160px]"
          style={{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.tab.closable !== false && (
            <button
              class="w-full px-3 py-1.5 text-sm text-left hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                if (contextMenu.tab) {
                  handleCloseTab(new MouseEvent('click'), contextMenu.tab)
                }
              }}
            >
              关闭标签
            </button>
          )}
          <button
            class="w-full px-3 py-1.5 text-sm text-left hover:bg-accent hover:text-accent-foreground"
            onClick={handleCloseOthers}
          >
            关闭其他
          </button>
          <button
            class="w-full px-3 py-1.5 text-sm text-left hover:bg-accent hover:text-accent-foreground"
            onClick={handleCloseRight}
          >
            关闭右侧
          </button>
          <div class="border-t border-border my-1" />
          <button
            class="w-full px-3 py-1.5 text-sm text-left hover:bg-accent hover:text-accent-foreground"
            onClick={handleCloseAll}
          >
            关闭所有
          </button>
        </div>
      )}
    </div>
  )
}
