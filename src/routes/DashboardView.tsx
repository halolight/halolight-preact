import { useEffect, useState } from 'preact/hooks'
import {
  Users,
  TrendingUp,
  ShoppingCart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-preact'
import { AdminLayout } from '../layouts/AdminLayout'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import { fetchDashboardSummary, fetchDashboardVisits, fetchDashboardOrders } from '../api/dashboard'
import type { DashboardStats, VisitData, Order } from '../types'
import { cn } from '../lib/utils'

// 统计卡片组件
interface StatCardProps {
  title: string
  value: string | number
  change: number
  icon: typeof Users
  loading?: boolean
}

function StatCard({ title, value, change, icon: Icon, loading }: StatCardProps) {
  const isPositive = change >= 0

  if (loading) {
    return (
      <Card>
        <CardContent class="pt-6">
          <Skeleton class="h-4 w-20 mb-2" />
          <Skeleton class="h-8 w-32 mb-2" />
          <Skeleton class="h-4 w-16" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent class="pt-6">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-muted-foreground">{title}</p>
            <p class="text-2xl font-bold mt-2">{value}</p>
            <div class="flex items-center gap-1 mt-2">
              {isPositive ? (
                <ArrowUpRight class="h-4 w-4 text-green-600" />
              ) : (
                <ArrowDownRight class="h-4 w-4 text-red-600" />
              )}
              <span
                class={cn(
                  'text-sm font-medium',
                  isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {Math.abs(change)}%
              </span>
              <span class="text-sm text-muted-foreground">vs 上月</span>
            </div>
          </div>
          <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon class="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardView() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [visits, setVisits] = useState<VisitData[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsData, visitsData, ordersData] = await Promise.all([
        fetchDashboardSummary(),
        fetchDashboardVisits(),
        fetchDashboardOrders()
      ])
      setStats(statsData)
      setVisits(visitsData)
      setOrders(ordersData)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <AdminLayout>
      <div class="space-y-6">
        {/* 页面标题 */}
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold">仪表盘</h1>
            <p class="text-muted-foreground mt-1">欢迎回来，查看您的业务概况</p>
          </div>
          <Button onClick={loadData} disabled={loading}>
            <RefreshCw class={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
            刷新
          </Button>
        </div>

        {/* 统计卡片 */}
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="总用户数"
            value={stats?.totalUsers.toLocaleString() || '0'}
            change={stats?.userGrowth || 0}
            icon={Users}
            loading={loading}
          />
          <StatCard
            title="总收入"
            value={`¥${stats?.totalRevenue.toLocaleString() || '0'}`}
            change={stats?.revenueGrowth || 0}
            icon={TrendingUp}
            loading={loading}
          />
          <StatCard
            title="总订单"
            value={stats?.totalOrders.toLocaleString() || '0'}
            change={stats?.orderGrowth || 0}
            icon={ShoppingCart}
            loading={loading}
          />
          <StatCard
            title="转化率"
            value={`${stats?.conversionRate || '0'}%`}
            change={stats?.rateGrowth || 0}
            icon={Activity}
            loading={loading}
          />
        </div>

        {/* 访问趋势 */}
        <Card>
          <CardHeader>
            <CardTitle>访问趋势</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div class="space-y-3">
                <Skeleton class="h-8 w-full" />
                <Skeleton class="h-8 w-full" />
                <Skeleton class="h-8 w-full" />
              </div>
            ) : (
              <div class="space-y-2">
                {visits.slice(0, 7).map((visit) => (
                  <div key={visit.date} class="flex items-center justify-between py-2">
                    <span class="text-sm text-muted-foreground">{visit.date}</span>
                    <div class="flex items-center gap-4">
                      <span class="text-sm">访问量: {visit.visits}</span>
                      <span class="text-sm">浏览量: {visit.pageViews}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 最近订单 */}
        <Card>
          <CardHeader>
            <CardTitle>最近订单</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div class="space-y-3">
                <Skeleton class="h-12 w-full" />
                <Skeleton class="h-12 w-full" />
                <Skeleton class="h-12 w-full" />
              </div>
            ) : (
              <div class="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} class="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div class="flex items-center gap-3">
                      <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <ShoppingCart class="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p class="font-medium">{order.customer}</p>
                        <p class="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="font-semibold">¥{order.amount.toLocaleString()}</span>
                      <Badge
                        variant={
                          order.status === 'completed' ? 'success' :
                          order.status === 'processing' ? 'default' :
                          order.status === 'pending' ? 'warning' :
                          'destructive'
                        }
                      >
                        {order.status === 'completed' ? '已完成' :
                         order.status === 'processing' ? '处理中' :
                         order.status === 'pending' ? '待处理' :
                         '已取消'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default DashboardView