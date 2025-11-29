/**
 * 菜单配置
 * 定义侧边栏导航菜单
 */
export interface MenuItem {
  title: string
  icon?: string
  path?: string
  children?: MenuItem[]
  roles?: string[]
}

export const menuItems: MenuItem[] = [
  {
    title: '仪表盘',
    icon: 'LayoutDashboard',
    path: '/dashboard',
  },
  {
    title: '用户管理',
    icon: 'Users',
    path: '/users',
  },
  {
    title: '消息中心',
    icon: 'MessageSquare',
    path: '/messages',
  },
  {
    title: '文件管理',
    icon: 'FolderOpen',
    path: '/files',
  },
  {
    title: '日历',
    icon: 'Calendar',
    path: '/calendar',
  },
  {
    title: '数据分析',
    icon: 'BarChart3',
    path: '/analytics',
  },
  {
    title: '安全审计',
    icon: 'ShieldCheck',
    path: '/security',
  },
  {
    title: '系统设置',
    icon: 'Settings',
    path: '/settings',
  },
]