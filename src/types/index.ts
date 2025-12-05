/**
 * API 响应类型定义
 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export type PaginatedResponse<T = unknown> = ApiResponse<{
  list: T[]
  total: number
  page: number
  pageSize: number
}>

/**
 * 用户相关类型
 */
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: Role
  status: UserStatus
  department?: string
  position?: string
  bio?: string
  createdAt: string
  lastLoginAt?: string
}

export interface Role {
  id: string
  name: string
  permissions: Permission[]
  description?: string
}

export interface Permission {
  id: string
  name: string
  code: string
  description?: string
}

export type UserStatus = 'active' | 'inactive' | 'suspended'

/**
 * 认证相关类型
 */
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface ResetPasswordData {
  email: string
  password: string
  confirmPassword: string
  token: string
}

/**
 * 仪表盘相关类型
 */
export interface DashboardStats {
  totalUsers: number
  userGrowth: number
  totalRevenue: number
  revenueGrowth: number
  totalOrders: number
  orderGrowth: number
  conversionRate: number
  rateGrowth: number
}

export interface ChartData {
  name: string
  value: number
}

export interface VisitData {
  date: string
  visits: number
  pageViews: number
}

export interface SalesData {
  month: string
  sales: number
  orders: number
}

export interface Product {
  id: string
  name: string
  sales: number
  growth: number
}

export interface Order {
  id: string
  customer: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  date: string
}

export interface Activity {
  id: string
  user: string
  action: string
  timestamp: string
  type: 'login' | 'update' | 'create' | 'delete'
}

/**
 * 通知相关类型
 */
export interface Notification {
  id: string
  title: string
  content: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
  userId?: string
}

/**
 * 文件相关类型
 */
export interface FileItem {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: string
  uploadedBy?: string
}

/**
 * 消息相关类型
 */
export interface Message {
  id: string
  sender: User
  content: string
  timestamp: string
  read: boolean
  conversationId: string
}

export interface Conversation {
  id: string
  participants: User[]
  lastMessage?: Message
  unreadCount: number
  updatedAt: string
}

/**
 * 日历相关类型
 */
export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: string
  end: string
  allDay?: boolean
  color?: string
}

/**
 * 设置相关类型
 */
export interface Settings {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  notifications: {
    email: boolean
    push: boolean
    desktop: boolean
  }
  privacy: {
    profileVisible: boolean
    activityVisible: boolean
  }
}

/**
 * 安全审计相关类型
 */
export interface SecurityLog {
  id: string
  user: User
  action: string
  ip: string
  userAgent: string
  timestamp: string
  success: boolean
}

/**
 * 仪表盘部件类型
 */
export type WidgetType =
  | 'stats'
  | 'chart-line'
  | 'chart-bar'
  | 'chart-pie'
  | 'recent-users'
  | 'notifications'
  | 'tasks'
  | 'calendar'
  | 'quick-actions'

export interface DashboardWidget {
  id: string
  type: WidgetType
  title: string
  config?: Record<string, unknown>
}

export interface Role {
  id: string
  name: string
  permissions: Permission[]
  description?: string
}

export interface Permission {
  id: string
  name: string
  code: string
  description?: string
}

export interface DashboardLayout {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
}

/**
 * 布局相关类型
 */
export interface TabItem {
  id: string
  title: string
  path: string
  closable: boolean
}