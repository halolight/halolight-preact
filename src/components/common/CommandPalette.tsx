import { useState, useEffect, useCallback } from 'preact/hooks'
import { route } from 'preact-router'
import {
  Search,
  Home,
  Users,
  Settings,
  FileText,
  FolderOpen,
  Mail,
  Calendar,
  BarChart3,
  Shield,
  Sun,
  Moon,
  LogOut,
  UserCheck,
  type LucideIcon
} from 'lucide-preact'
import { accounts, activeAccountId, switchAccount, logout } from '../../stores/auth'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Command {
  id: string
  label: string
  icon: LucideIcon
  action: () => void | boolean | Promise<void>
  keywords?: string[]
  category: string
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  // 导航命令
  const navigationCommands: Command[] = [
    {
      id: 'nav-home',
      label: '仪表盘',
      icon: Home,
      action: () => route('/'),
      keywords: ['dashboard', 'home'],
      category: '导航'
    },
    {
      id: 'nav-users',
      label: '用户管理',
      icon: Users,
      action: () => route('/users'),
      keywords: ['users', 'user management'],
      category: '导航'
    },
    {
      id: 'nav-analytics',
      label: '数据分析',
      icon: BarChart3,
      action: () => route('/analytics'),
      keywords: ['analytics', 'data'],
      category: '导航'
    },
    {
      id: 'nav-documents',
      label: '文档管理',
      icon: FileText,
      action: () => route('/documents'),
      keywords: ['documents', 'docs'],
      category: '导航'
    },
    {
      id: 'nav-files',
      label: '文件存储',
      icon: FolderOpen,
      action: () => route('/files'),
      keywords: ['files', 'storage'],
      category: '导航'
    },
    {
      id: 'nav-messages',
      label: '消息中心',
      icon: Mail,
      action: () => route('/messages'),
      keywords: ['messages', 'mail'],
      category: '导航'
    },
    {
      id: 'nav-calendar',
      label: '日程安排',
      icon: Calendar,
      action: () => route('/calendar'),
      keywords: ['calendar', 'schedule'],
      category: '导航'
    },
    {
      id: 'nav-accounts',
      label: '账号与权限',
      icon: Shield,
      action: () => route('/accounts'),
      keywords: ['accounts', 'permissions'],
      category: '导航'
    },
    {
      id: 'nav-settings',
      label: '系统设置',
      icon: Settings,
      action: () => route('/settings'),
      keywords: ['settings'],
      category: '导航'
    }
  ]

  // 主题命令
  const themeCommands: Command[] = [
    {
      id: 'theme-light',
      label: '浅色模式',
      icon: Sun,
      action: () => {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      },
      category: '主题'
    },
    {
      id: 'theme-dark',
      label: '深色模式',
      icon: Moon,
      action: () => {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      },
      category: '主题'
    }
  ]

  // 账号命令
  const accountCommands: Command[] = accounts.value.map((account) => ({
    id: `account-${account.id}`,
    label: `切换为 ${account.name}`,
    icon: UserCheck,
    action: async () => {
      if (account.id !== activeAccountId.value) {
        await switchAccount(account.id)
        // 刷新页面以应用新账号
        window.location.reload()
      }
    },
    keywords: [account.name, account.email],
    category: '账号'
  }))

  // 操作命令
  const actionCommands: Command[] = [
    {
      id: 'action-search',
      label: '全局搜索',
      icon: Search,
      action: () => {
        // TODO: 实现全局搜索功能
      },
      keywords: ['search', 'find'],
      category: '操作'
    },
    {
      id: 'action-logout',
      label: '退出登录',
      icon: LogOut,
      action: async () => {
        await logout()
        route('/login')
      },
      keywords: ['logout', 'signout'],
      category: '操作'
    }
  ]

  // 合并所有命令
  const allCommands = [
    ...navigationCommands,
    ...themeCommands,
    ...accountCommands,
    ...actionCommands
  ]

  // 过滤命令
  const filteredCommands = search
    ? allCommands.filter((cmd) => {
        const searchLower = search.toLowerCase()
        const matchLabel = cmd.label.toLowerCase().includes(searchLower)
        const matchKeywords = cmd.keywords?.some((k) => k.toLowerCase().includes(searchLower))
        return matchLabel || matchKeywords
      })
    : allCommands

  // 按类别分组
  const groupedCommands = filteredCommands.reduce((groups, cmd) => {
    if (!groups[cmd.category]) {
      groups[cmd.category] = []
    }
    groups[cmd.category].push(cmd)
    return groups
  }, {} as Record<string, Command[]>)

  // 执行命令
  const executeCommand = useCallback(async (cmd: Command) => {
    onOpenChange(false)
    setSearch('')
    setSelectedIndex(0)
    await cmd.action()
  }, [onOpenChange])

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K 或 Ctrl+K 打开命令面板
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
        return
      }

      if (!open) return

      // ESC 关闭
      if (e.key === 'Escape') {
        onOpenChange(false)
        setSearch('')
        setSelectedIndex(0)
        return
      }

      // 上下键导航
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      }

      // 回车执行命令
      if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault()
        executeCommand(filteredCommands[selectedIndex])
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, filteredCommands, selectedIndex, executeCommand, onOpenChange])

  // 重置选中索引当搜索改变时
  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  if (!open) return null

  return (
    <div
      class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div class="fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-2xl">
        <div
          class="bg-popover text-popover-foreground rounded-lg shadow-lg border border-border overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 搜索输入 */}
          <div class="flex items-center border-b border-border px-4">
            <Search class="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={search}
              onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
              placeholder="输入命令或搜索..."
              class="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            <kbd class="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ESC
            </kbd>
          </div>

          {/* 命令列表 */}
          <div class="max-h-[400px] overflow-y-auto p-2">
            {filteredCommands.length === 0 ? (
              <div class="py-6 text-center text-sm text-muted-foreground">
                未找到结果
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, commands]) => (
                <div key={category} class="mb-2 last:mb-0">
                  <div class="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    {category}
                  </div>
                  {commands.map((cmd) => {
                    const globalIndex = filteredCommands.indexOf(cmd)
                    const isSelected = globalIndex === selectedIndex
                    const Icon = cmd.icon

                    return (
                      <button
                        key={cmd.id}
                        class={`w-full flex items-center gap-2 px-2 py-2 text-sm rounded-md transition-colors ${
                          isSelected
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                        onClick={() => executeCommand(cmd)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                      >
                        <Icon className="h-4 w-4" />
                        <span class="flex-1 text-left">{cmd.label}</span>
                        {cmd.id.startsWith('account-') &&
                          cmd.id === `account-${activeAccountId.value}` && (
                            <span class="text-xs text-muted-foreground">当前</span>
                          )}
                      </button>
                    )
                  })}
                </div>
              ))
            )}
          </div>

          {/* 底部提示 */}
          <div class="border-t border-border px-4 py-2 text-xs text-muted-foreground flex items-center justify-between">
            <div class="flex items-center gap-2">
              <kbd class="inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium">
                ↑↓
              </kbd>
              <span>导航</span>
              <kbd class="inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium">
                Enter
              </kbd>
              <span>选择</span>
            </div>
            <div>
              <kbd class="inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
