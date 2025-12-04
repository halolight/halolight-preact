import { h } from 'preact'
import { useMemo } from 'preact/hooks'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { useDashboardData } from '../../../stores/dashboard'

interface BarChartWidgetProps {
  isMobile?: boolean
}

export function BarChartWidget({ isMobile }: BarChartWidgetProps) {
  const { salesData, isLoading } = useDashboardData()

  const chartData = useMemo(() => {
    if (!salesData.value || salesData.value.length === 0) return []

    return salesData.value.map((item) => ({
      month: item.month.slice(5), // 只显示月份 MM
      销售���: item.sales,
      订单数: item.orders * 100 // 缩放以便在同一图表中显示
    }))
  }, [salesData.value])

  const chartHeight = isMobile ? 200 : 260

  if (isLoading.value) {
    return (
      <div class="flex items-center justify-center h-full">
        <div class="text-sm text-muted-foreground">加载中...</div>
      </div>
    )
  }

  return (
    <div style={{ height: chartHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="month"
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'var(--radius)',
              fontSize: '12px'
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
            iconSize={12}
          />
          <Bar
            dataKey="销售额"
            fill="hsl(var(--chart-1))"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="订单数"
            fill="hsl(var(--chart-2))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
