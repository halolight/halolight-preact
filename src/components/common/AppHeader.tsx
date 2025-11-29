import { route } from 'preact-router'
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  User,
  LogOut,
  Settings
} from 'lucide-preact'
import { Button } from '../ui/Button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar'
import {
  toggleMobileSidebar,
  toggleThemeWithTransition,
  isDark
} from '../../stores/layout'
import { user, initials, logout } from '../../stores/auth'
import { config } from '../../config/env'
import { useState, useRef, useEffect } from 'preact/hooks'

export function AppHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    route('/login')
  }

  const handleThemeToggle = (e: MouseEvent) => {
    toggleThemeWithTransition(e)
  }

  return (
    <header class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
      {/* 移动端菜单按钮 */}
      <Button
        variant="ghost"
        size="icon"
        class="md:hidden"
        onClick={() => toggleMobileSidebar()}
      >
        <Menu class="h-5 w-5" />
        <span class="sr-only">Toggle menu</span>
      </Button>

      {/* 搜索框 */}
      <div class="flex-1 md:max-w-md">
        <div class="relative">
          <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="搜索..."
            class="w-full rounded-md border border-input bg-background pl-8 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </div>

      {/* 右侧操作区 */}
      <div class="flex items-center gap-2">
        {/* 主题切换 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleThemeToggle}
          title={isDark.value ? '切换到浅色模式' : '切换到深色模式'}
        >
          {isDark.value ? (
            <Sun class="h-5 w-5" />
          ) : (
            <Moon class="h-5 w-5" />
          )}
        </Button>

        {/* 通知 */}
        <div class="relative" ref={notificationsRef}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell class="h-5 w-5" />
            <span class="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
              3
            </span>
          </Button>

          {/* 通知下拉菜单 */}
          {showNotifications && (
            <div class="absolute right-0 mt-2 w-80 rounded-md border bg-popover p-4 shadow-lg animate-fade-in">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold">通知</h3>
                <Button variant="ghost" size="sm">全部已读</Button>
              </div>
              <div class="space-y-3">
                <div class="flex gap-3 p-2 rounded-md hover:bg-muted cursor-pointer">
                  <div class="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <div>
                    <p class="text-sm">系统通知</p>
                    <p class="text-xs text-muted-foreground">您的订单已发货</p>
                  </div>
                </div>
                <div class="flex gap-3 p-2 rounded-md hover:bg-muted cursor-pointer">
                  <div class="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <div>
                    <p class="text-sm">安全提醒</p>
                    <p class="text-xs text-muted-foreground">检测到新设备登录</p>
                  </div>
                </div>
                <div class="flex gap-3 p-2 rounded-md hover:bg-muted cursor-pointer">
                  <div class="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <div>
                    <p class="text-sm">活动公告</p>
                    <p class="text-xs text-muted-foreground">限时优惠即将开始</p>
                  </div>
                </div>
              </div>
              <div class="mt-4 pt-4 border-t">
                <Button variant="ghost" class="w-full" onClick={() => route('/notifications')}>
                  查看全部通知
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* 用户菜单 */}
        <div class="relative" ref={userMenuRef}>
          <Button
            variant="ghost"
            class="flex items-center gap-2 px-2"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <Avatar size="sm">
              <AvatarImage src={user.value?.avatar} alt={user.value?.name} />
              <AvatarFallback>{initials.value}</AvatarFallback>
            </Avatar>
            <span class="hidden md:inline text-sm font-medium">
              {user.value?.name || config.brandName}
            </span>
          </Button>

          {/* 用户下拉菜单 */}
          {showUserMenu && (
            <div class="absolute right-0 mt-2 w-56 rounded-md border bg-popover p-1 shadow-lg animate-fade-in">
              <div class="px-3 py-2 border-b mb-1">
                <p class="font-medium">{user.value?.name}</p>
                <p class="text-xs text-muted-foreground">{user.value?.email}</p>
              </div>
              <button
                class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                onClick={() => {
                  setShowUserMenu(false)
                  route('/profile')
                }}
              >
                <User class="h-4 w-4" />
                个人资料
              </button>
              <button
                class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                onClick={() => {
                  setShowUserMenu(false)
                  route('/settings')
                }}
              >
                <Settings class="h-4 w-4" />
                系统设置
              </button>
              <div class="border-t mt-1 pt-1">
                <button
                  class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-muted"
                  onClick={handleLogout}
                >
                  <LogOut class="h-4 w-4" />
                  退出登录
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default AppHeader