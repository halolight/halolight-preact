import { useMemo } from 'preact/hooks'

interface CalendarWidgetProps {
  isMobile?: boolean
}

interface CalendarEvent {
  id: number
  title: string
  start: string
  end?: string
  type?: 'meeting' | 'task' | 'event'
}

// Mock calendar events - in real app this would come from the store
const mockEvents: CalendarEvent[] = [
  {
    id: 1,
    title: '��队周会',
    start: new Date().toISOString(),
    end: new Date(Date.now() + 3600000).toISOString(),
    type: 'meeting'
  },
  {
    id: 2,
    title: '项目评审',
    start: new Date(Date.now() + 7200000).toISOString(),
    end: new Date(Date.now() + 10800000).toISOString(),
    type: 'meeting'
  },
  {
    id: 3,
    title: '代码提交截止',
    start: new Date(Date.now() + 14400000).toISOString(),
    type: 'task'
  },
  {
    id: 4,
    title: '午餐会议',
    start: new Date(Date.now() + 18000000).toISOString(),
    end: new Date(Date.now() + 21600000).toISOString(),
    type: 'event'
  },
  {
    id: 5,
    title: '客户演示',
    start: new Date(Date.now() + 25200000).toISOString(),
    end: new Date(Date.now() + 28800000).toISOString(),
    type: 'meeting'
  },
  {
    id: 6,
    title: '文档更新',
    start: new Date(Date.now() + 32400000).toISOString(),
    type: 'task'
  }
]

export function CalendarWidget({ isMobile }: CalendarWidgetProps) {
  const today = useMemo(() => {
    const d = new Date()
    return d.toISOString().slice(0, 10)
  }, [])

  const todayEvents = useMemo(() => {
    return mockEvents.filter((event) => {
      const start = event.start?.slice(0, 10)
      return start === today
    })
  }, [today])

  const formatRange = (start?: string, end?: string) => {
    if (!start) return '时间未定'
    const startDate = new Date(start)
    const endDate = end ? new Date(end) : null

    const fmt = new Intl.DateTimeFormat('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })

    const startStr = fmt.format(startDate)
    const endStr = endDate ? fmt.format(endDate) : ''
    return endStr ? `${startStr} - ${endStr}` : startStr
  }

  const displayList = isMobile ? todayEvents.slice(0, 3) : todayEvents.slice(0, 6)

  const getEventTypeColor = (type?: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting':
        return 'border-l-primary'
      case 'task':
        return 'border-l-chart-2'
      case 'event':
        return 'border-l-chart-3'
      default:
        return 'border-l-muted-foreground'
    }
  }

  return (
    <div class="h-full flex flex-col gap-3">
      <div class="flex-1 overflow-auto rounded-md border bg-muted/30 p-3">
        {todayEvents.length === 0 && (
          <p class="text-xs text-muted-foreground text-center py-4">暂无日程</p>
        )}
        {todayEvents.length > 0 && (
          <ul class="space-y-2">
            {displayList.map((event) => (
              <li
                key={event.id}
                class={`flex items-start justify-between gap-2 rounded-md bg-background p-2 shadow-sm border-l-2 ${getEventTypeColor(event.type)}`}
              >
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium leading-tight truncate">
                    {event.title || '未命名事件'}
                  </p>
                  <p class="text-[11px] text-muted-foreground leading-tight mt-0.5">
                    {formatRange(event.start, event.end)}
                  </p>
                </div>
                <span class="text-[11px] text-muted-foreground whitespace-nowrap">
                  {event.type === 'meeting' ? '会议' : event.type === 'task' ? '任务' : '事件'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
