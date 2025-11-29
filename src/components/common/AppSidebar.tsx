import { route } from 'preact-router'
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  FolderOpen,
  Calendar,
  BarChart3,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-preact'
import { Button } from '../ui/Button'
import {
  sidebarCollapsed,
  mobileSidebarOpen,
  toggleSidebar,
  closeMobileSidebar
} from '../../stores/layout'
import { config } from '../../config/env'
import { menuItems } from '../../config/menu'
import { cn } from '../../lib/utils'

// 图标映射
const iconMap: Record<string, typeof LayoutDashboard> = {
  LayoutDashboard,
  Users,
  MessageSquare,
  FolderOpen,
  Calendar,
  BarChart3,
  ShieldCheck,
  Settings
}

interface NavItemProps {
  title: string
  icon?: string
  path?: string
  active?: boolean
  collapsed?: boolean
}

function NavItem({ title, icon, path, active, collapsed }: NavItemProps) {
  const Icon = icon ? iconMap[icon] : null

  const handleClick = () => {
    if (path) {
      route(path)
      closeMobileSidebar()
    }
  }

  return (
    <button
      onClick={handleClick}
      class={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors w-full text-left',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        collapsed && 'justify-center px-2'
      )}
      title={collapsed ? title : undefined}
    >
      {Icon && <Icon class="h-5 w-5 shrink-0" />}
      {!collapsed && <span class="truncate">{title}</span>}
    </button>
  )
}

export function AppSidebar() {
  // 获取当前路径
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/'

  return (
    <>
      {/* 桌面端侧边栏 */}
      <aside
        class={cn(
          'fixed inset-y-0 left-0 z-50 hidden md:flex flex-col border-r bg-background transition-all duration-300',
          sidebarCollapsed.value ? 'w-16' : 'w-[200px]'
        )}
      >
        {/* Logo */}
        <div class={cn(
          'flex h-14 items-center border-b px-4',
          sidebarCollapsed.value ? 'justify-center' : 'gap-2'
        )}>
          <div class="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span class="text-lg font-bold text-primary-foreground">H</span>
          </div>
          {!sidebarCollapsed.value && (
            <span class="font-semibold truncate">{config.brandName}</span>
          )}
        </div>

        {/* 导航菜单 */}
        <nav class="flex-1 overflow-y-auto p-2 space-y-1">
          {menuItems.map((item) => (
            <NavItem
              key={item.path}
              title={item.title}
              icon={item.icon}
              path={item.path}
              active={Boolean(currentPath === item.path || (item.path && currentPath.startsWith(item.path + '/')))}
              collapsed={sidebarCollapsed.value}
            />
          ))}
        </nav>

        {/* 折叠按钮 */}
        <div class="border-t p-2">
          <Button
            variant="ghost"
            size="icon"
            class="w-full"
            onClick={() => toggleSidebar()}
            title={sidebarCollapsed.value ? '展开侧边栏' : '收起侧边栏'}
          >
            {sidebarCollapsed.value ? (
              <ChevronRight class="h-4 w-4" />
            ) : (
              <ChevronLeft class="h-4 w-4" />
            )}
          </Button>
        </div>
      </aside>

      {/* 移动端侧边栏 */}
      <aside
        class={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col w-[240px] border-r bg-background transition-transform duration-300 md:hidden',
          mobileSidebarOpen.value ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div class="flex h-14 items-center border-b px-4 gap-2">
          <div class="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span class="text-lg font-bold text-primary-foreground">H</span>
          </div>
          <span class="font-semibold">{config.brandName}</span>
        </div>

        {/* 导航菜单 */}
        <nav class="flex-1 overflow-y-auto p-2 space-y-1">
          {menuItems.map((item) => (
            <NavItem
              key={item.path}
              title={item.title}
              icon={item.icon}
              path={item.path}
              active={Boolean(currentPath === item.path || (item.path && currentPath.startsWith(item.path + '/')))}
            />
          ))}
        </nav>
      </aside>
    </>
  )
}

export default AppSidebar