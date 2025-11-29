import { get } from "./client"
import type {
  DashboardStats,
  VisitData,
  SalesData,
  ChartData,
  Product,
  Order,
  Activity
} from "../types"

/**
 * 获取仪表盘统计数据
 */
export async function fetchDashboardSummary(): Promise<DashboardStats> {
  return get("/dashboard/summary")
}

/**
 * 获取访问趋势数据
 */
export async function fetchDashboardVisits(): Promise<VisitData[]> {
  return get("/dashboard/visits")
}

/**
 * 获取销售趋势数据
 */
export async function fetchDashboardSales(): Promise<SalesData[]> {
  return get("/dashboard/sales")
}

/**
 * 获取产品数据
 */
export async function fetchDashboardProducts(): Promise<Product[]> {
  return get("/dashboard/products")
}

/**
 * 获取订单数据
 */
export async function fetchDashboardOrders(): Promise<Order[]> {
  return get("/dashboard/orders")
}

/**
 * 获取用户活动数据
 */
export async function fetchDashboardActivities(): Promise<Activity[]> {
  return get("/dashboard/activities")
}

/**
 * 获取流量来源数据
 */
export async function fetchDashboardTrafficSources(): Promise<ChartData[]> {
  return get("/dashboard/traffic-sources")
}

/**
 * 获取地区分布数据
 */
export async function fetchDashboardRegions(): Promise<ChartData[]> {
  return get("/dashboard/regions")
}

/**
 * 获取设备类型数据
 */
export async function fetchDashboardDevices(): Promise<ChartData[]> {
  return get("/dashboard/devices")
}

/**
 * 获取浏览器类型数据
 */
export async function fetchDashboardBrowsers(): Promise<ChartData[]> {
  return get("/dashboard/browsers")
}

/**
 * 获取实时数据
 */
export async function fetchDashboardRealtime(): Promise<{
  onlineUsers: number
  pageViews: number
  activeSessions: number
  bounceRate: number
}> {
  return get("/dashboard/realtime")
}

/**
 * 获取性能指标
 */
export async function fetchDashboardPerformance(): Promise<{
  avgLoadTime: number
  avgResponseTime: number
  errorRate: number
  uptime: number
}> {
  return get("/dashboard/performance")
}