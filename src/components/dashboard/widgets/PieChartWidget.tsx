import { useMemo } from 'preact/hooks'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { useDashboardData } from '../../../stores/dashboard'

interface TrafficSource {
  name: string
  value: number
}

interface PieChartWidgetProps {
  isMobile?: boolean
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
]

interface ChartDataItem {
  name: string
  value: number
  fill: string
  [key: string]: string | number
}

export function PieChartWidget({ isMobile }: PieChartWidgetProps) {
  const { trafficSources, isLoading } = useDashboardData()

  const chartData: ChartDataItem[] = useMemo(() => {
    if (!trafficSources.value || trafficSources.value.length === 0) return []
    return trafficSources.value.map((item: TrafficSource, index: number) => ({
      name: item.name,
      value: item.value,
      fill: COLORS[index % COLORS.length]
    }))
  }, [trafficSources.value])

  const chartHeight = isMobile ? 220 : 260

  if (isLoading.value) {
    return (
      <div class="flex items-center justify-center h-full">
        <div class="text-sm text-muted-foreground">加载���...</div>
      </div>
    )
  }

  return (
    <div class="h-full flex flex-col gap-4">
      <div style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry: ChartDataItem, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                fontSize: '12px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div class="flex flex-wrap justify-center gap-3">
        {chartData.map((item: ChartDataItem, index: number) => (
          <div key={index} class="flex items-center gap-2">
            <span
              class="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.fill }}
            />
            <span class="text-xs text-muted-foreground">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
