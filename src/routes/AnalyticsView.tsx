import { useState, useEffect } from 'preact/hooks'
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Activity, RefreshCw } from 'lucide-preact'
import { AdminLayout } from '../layouts/AdminLayout'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import { cn } from '../lib/utils'

interface StatItem {
  title: string
  value: string
  change: number
  icon: typeof Users
}

export function AnalyticsView() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<StatItem[]>([])
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([])

  useEffect(() => {
    setTimeout(() => {
      setStats([
        { title: '总访问量', value: '125,430', change: 12.5, icon: Activity },
        { title: '新用户', value: '3,842', change: 8.2, icon: Users },
        { title: '订单数', value: '892', change: -2.4, icon: ShoppingCart },
        { title: '收入', value: '¥284,500', change: 15.8, icon: DollarSign },
      ])
      setChartData([
        { name: '周一', value: 120 },
        { name: '周二', value: 180 },
        { name: '周三', value: 150 },
        { name: '周四', value: 200 },
        { name: '周五', value: 280 },
        { name: '周六', value: 220 },
        { name: '周日', value: 160 },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const maxValue = Math.max(...chartData.map(d => d.value))

  return (
    <AdminLayout>
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold">数据分析</h1>
            <p class="text-muted-foreground mt-1">查看系统关键指标和数据趋势</p>
          </div>
          <Button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1000) }}>
            <RefreshCw class={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
            刷新数据
          </Button>
        </div>

        {/* 统计卡片 */}
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent class="pt-6">
                  <Skeleton class="h-4 w-20 mb-2" />
                  <Skeleton class="h-8 w-32 mb-2" />
                  <Skeleton class="h-4 w-24" />
                </CardContent>
              </Card>
            ))
          ) : (
            stats.map((stat, index) => {
              const Icon = stat.icon
              const isPositive = stat.change >= 0
              return (
                <Card key={index}>
                  <CardContent class="pt-6">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p class="text-2xl font-bold mt-2">{stat.value}</p>
                        <div class="flex items-center gap-1 mt-2">
                          {isPositive ? (
                            <TrendingUp class="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown class="h-4 w-4 text-red-600" />
                          )}
                          <span class={cn(
                            'text-sm font-medium',
                            isPositive ? 'text-green-600' : 'text-red-600'
                          )}>
                            {Math.abs(stat.change)}%
                          </span>
                          <span class="text-sm text-muted-foreground">vs 上周</span>
                        </div>
                      </div>
                      <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon class="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* 图表 */}
        <div class="grid gap-6 lg:grid-cols-2">
          {/* 访问趋势 */}
          <Card>
            <CardHeader>
              <CardTitle>本周访问趋势</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton class="h-64 w-full" />
              ) : (
                <div class="h-64 flex items-end justify-between gap-2">
                  {chartData.map((item, index) => (
                    <div key={index} class="flex-1 flex flex-col items-center gap-2">
                      <div
                        class="w-full bg-primary/80 rounded-t-md transition-all hover:bg-primary"
                        style={{ height: `${(item.value / maxValue) * 200}px` }}
                      />
                      <span class="text-xs text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 流量来源 */}
          <Card>
            <CardHeader>
              <CardTitle>流量来源</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div class="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} class="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <div class="space-y-4">
                  {[
                    { name: '搜索引擎', value: 45, color: 'bg-blue-500' },
                    { name: '直接访问', value: 30, color: 'bg-green-500' },
                    { name: '社交媒体', value: 15, color: 'bg-purple-500' },
                    { name: '邮件营销', value: 6, color: 'bg-orange-500' },
                    { name: '其他', value: 4, color: 'bg-gray-500' },
                  ].map((source, index) => (
                    <div key={index} class="space-y-2">
                      <div class="flex justify-between text-sm">
                        <span>{source.name}</span>
                        <span class="font-medium">{source.value}%</span>
                      </div>
                      <div class="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          class={cn('h-full rounded-full transition-all', source.color)}
                          style={{ width: `${source.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 设备分布 */}
        <Card>
          <CardHeader>
            <CardTitle>设备分布</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div class="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} class="h-24" />
                ))}
              </div>
            ) : (
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: '桌面端', value: '58%', icon: '🖥️' },
                  { name: '移动端', value: '35%', icon: '📱' },
                  { name: '平板端', value: '7%', icon: '📟' },
                ].map((device, index) => (
                  <div key={index} class="text-center p-6 rounded-lg border">
                    <div class="text-4xl mb-2">{device.icon}</div>
                    <p class="font-medium">{device.name}</p>
                    <p class="text-2xl font-bold text-primary mt-1">{device.value}</p>
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

export default AnalyticsView
