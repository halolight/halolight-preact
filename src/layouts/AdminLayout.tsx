import type { ComponentChildren } from 'preact'
import { useEffect } from 'preact/hooks'
import { AppHeader } from '../components/common/AppHeader'
import { AppSidebar } from '../components/common/AppSidebar'
import { AppFooter } from '../components/common/AppFooter'
import { initLayout, sidebarCollapsed, mobileSidebarOpen, showFooter } from '../stores/layout'
import { cn } from '../lib/utils'

interface AdminLayoutProps {
  children: ComponentChildren
}

export function AdminLayout({ children }: AdminLayoutProps) {
  useEffect(() => {
    initLayout()
  }, [])

  return (
    <div class="flex min-h-screen bg-background">
      {/* 侧边栏 */}
      <AppSidebar />

      {/* 移动端遮罩层 */}
      {mobileSidebarOpen.value && (
        <div
          class="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => mobileSidebarOpen.value = false}
        />
      )}

      {/* 主内容区域 */}
      <div
        class={cn(
          'flex flex-1 flex-col transition-all duration-300',
          sidebarCollapsed.value ? 'md:ml-16' : 'md:ml-[200px]'
        )}
      >
        {/* 头部 */}
        <AppHeader />

        {/* 页面内容 */}
        <main class="flex-1 overflow-auto p-4 md:p-6">
          <div class="mx-auto max-w-7xl animate-fade-in">
            {children}
          </div>
        </main>

        {/* 页脚 */}
        {showFooter.value && <AppFooter />}
      </div>
    </div>
  )
}

export default AdminLayout