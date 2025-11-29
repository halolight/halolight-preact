import { useState, useMemo, useEffect } from 'preact/hooks'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Plus,
  Users,
  Video,
} from 'lucide-preact'
import { AdminLayout } from '../layouts/AdminLayout'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { cn } from '../lib/utils'

interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  type: 'meeting' | 'task' | 'reminder' | 'holiday'
  location?: string
  attendees?: { name: string }[]
}

const typeColors: Record<string, string> = {
  meeting: 'bg-blue-500',
  task: 'bg-green-500',
  reminder: 'bg-yellow-500',
  holiday: 'bg-purple-500',
}

const typeLabels: Record<string, string> = {
  meeting: '会议',
  task: '任务',
  reminder: '提醒',
  holiday: '假日',
}

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function getDateFromEvent(event: CalendarEvent): string {
  return event.start.split('T')[0]
}

function getEventTypeColor(type?: string): string {
  return type && typeColors[type] ? typeColors[type] : 'bg-muted-foreground'
}

function getEventTypeLabel(type?: string): string {
  return type && typeLabels[type] ? typeLabels[type] : '其他'
}

export function CalendarView() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    setTimeout(() => {
      setEvents([
        { id: '1', title: '项目评审会议', start: '2024-11-28T10:00:00', end: '2024-11-28T11:00:00', type: 'meeting', location: '会议室A', attendees: [{ name: '张三' }, { name: '李四' }] },
        { id: '2', title: '提交周报', start: '2024-11-29T17:00:00', end: '2024-11-29T17:30:00', type: 'task' },
        { id: '3', title: '客户电话', start: '2024-11-30T14:00:00', end: '2024-11-30T15:00:00', type: 'meeting', location: '线上会议' },
        { id: '4', title: '发布新版本', start: '2024-12-01T09:00:00', end: '2024-12-01T10:00:00', type: 'task' },
        { id: '5', title: '团队建设', start: '2024-12-02T14:00:00', end: '2024-12-02T18:00:00', type: 'reminder', location: '公司楼下' },
        { id: '6', title: '季度总结会议', start: '2024-12-05T09:00:00', end: '2024-12-05T12:00:00', type: 'meeting', location: '大会议室', attendees: [{ name: '全体员工' }] },
        { id: '7', title: '元旦假期', start: '2025-01-01T00:00:00', end: '2025-01-01T23:59:00', type: 'holiday' },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
  }

  const getEventsForDate = (date: string) => {
    return events.filter(event => getDateFromEvent(event) === date)
  }

  const selectedDateStr = formatDate(selectedDate)
  const todayDateStr = formatDate(new Date())
  const selectedEvents = getEventsForDate(selectedDateStr)

  const calendarDays = useMemo(() => {
    const days = []
    const prevMonthDays = new Date(year, month, 0).getDate()

    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        date: formatDate(new Date(year, month - 1, prevMonthDays - i)),
      })
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: formatDate(new Date(year, month, i)),
      })
    }

    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: formatDate(new Date(year, month + 1, i)),
      })
    }

    return days
  }, [year, month, firstDayWeekday, daysInMonth])

  const upcomingEvents = useMemo(() => {
    const today = new Date()
    return events
      .filter(event => new Date(event.start) >= today)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 4)
  }, [events])

  return (
    <AdminLayout>
      <div class="space-y-6">
        {/* 页面标题 */}
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">日程安排</h1>
          </div>
          <Button>
            <Plus class="mr-2 h-4 w-4" />
            新建日程
          </Button>
        </div>

        {/* 移动端月份导航和操作 */}
        <div class="lg:hidden">
          <Card class="mb-4">
            <CardContent class="p-3">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    今天
                  </Button>
                  <div class="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={prevMonth}>
                      <ChevronLeft class="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={nextMonth}>
                      <ChevronRight class="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <h2 class="text-lg font-semibold">
                  {year}年{month + 1}月
                </h2>
              </div>
              {/* 类型图例 */}
              <div class="flex items-center gap-2 flex-wrap">
                {Object.entries(typeLabels).map(([type, label]) => (
                  <div key={type} class="flex items-center gap-1">
                    <div class={cn('h-2 w-2 rounded-full', typeColors[type])} />
                    <span class="text-xs text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          {/* 日历 */}
          <div class="lg:col-span-2">
            <Card>
              <CardHeader class="pb-3 hidden lg:block">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={goToToday}>
                      今天
                    </Button>
                    <div class="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={prevMonth}>
                        <ChevronLeft class="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={nextMonth}>
                        <ChevronRight class="h-4 w-4" />
                      </Button>
                    </div>
                    <h2 class="text-lg font-semibold">
                      {year}年{month + 1}月
                    </h2>
                  </div>
                  <div class="flex items-center gap-2">
                    {Object.entries(typeLabels).map(([type, label]) => (
                      <div key={type} class="flex items-center gap-1">
                        <div class={cn('h-2 w-2 rounded-full', typeColors[type])} />
                        <span class="text-xs text-muted-foreground">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div class="flex items-center justify-center py-24">
                    <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  </div>
                ) : (
                  <>
                    {/* 星期标题 */}
                    <div class="grid grid-cols-7 mb-2">
                      {weekDays.map((day) => (
                        <div
                          key={day}
                          class="text-center text-sm font-medium text-muted-foreground py-2"
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* 日期格子 */}
                    <div class="grid grid-cols-7 gap-px sm:gap-1">
                      {calendarDays.map((item, index) => {
                        const dayEvents = getEventsForDate(item.date)
                        const isSelected = item.date === selectedDateStr
                        const isToday = item.date === todayDateStr

                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedDate(new Date(item.date))}
                            class={cn(
                              'relative aspect-square p-0.5 sm:p-1 rounded transition-colors text-xs sm:text-sm',
                              item.isCurrentMonth
                                ? 'hover:bg-muted'
                                : 'text-muted-foreground/30',
                              isSelected && 'bg-primary text-primary-foreground hover:bg-primary',
                              isToday && !isSelected && 'ring-1 sm:ring-2 ring-primary'
                            )}
                          >
                            <span class="text-xs sm:text-sm">{item.day}</span>
                            {dayEvents.length > 0 && (
                              <div class="absolute bottom-0.5 sm:bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                                {dayEvents.slice(0, 2).map((event, i) => (
                                  <div
                                    key={i}
                                    class={cn(
                                      'h-0.5 w-0.5 sm:h-1 sm:w-1 rounded-full',
                                      isSelected ? 'bg-primary-foreground' : getEventTypeColor(event.type)
                                    )}
                                  />
                                ))}
                                {dayEvents.length > 2 && (
                                  <div
                                    class={cn(
                                      'h-0.5 w-0.5 sm:h-1 sm:w-1 rounded-full',
                                      isSelected ? 'bg-primary-foreground' : 'bg-muted-foreground'
                                    )}
                                  />
                                )}
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 桌面端日程列表 */}
          <div class="hidden lg:block">
            <Card class="h-full">
              <CardHeader>
                <CardTitle class="text-base">
                  {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日 日程
                </CardTitle>
                <CardDescription>
                  {selectedEvents.length > 0
                    ? `共 ${selectedEvents.length} 个日程`
                    : '暂无日程'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div class="h-[400px] overflow-y-auto pr-4">
                  {selectedEvents.length > 0 ? (
                    <div class="space-y-4">
                      {selectedEvents.map((event) => (
                        <div
                          key={event.id}
                          class="relative rounded-lg border p-4 hover:shadow-md transition-shadow"
                        >
                          <div
                            class={cn(
                              'absolute left-0 top-0 bottom-0 w-1 rounded-l-lg',
                              getEventTypeColor(event.type)
                            )}
                          />
                          <div class="flex items-start justify-between">
                            <div class="space-y-1">
                              <h4 class="font-medium">{event.title}</h4>
                              <div class="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock class="h-3 w-3" />
                                {formatTime(event.start)} - {formatTime(event.end)}
                              </div>
                              {event.location && (
                                <div class="flex items-center gap-2 text-sm text-muted-foreground">
                                  {event.location.includes('线上') ? (
                                    <Video class="h-3 w-3" />
                                  ) : (
                                    <MapPin class="h-3 w-3" />
                                  )}
                                  {event.location}
                                </div>
                              )}
                              {event.attendees && event.attendees.length > 0 && (
                                <div class="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Users class="h-3 w-3" />
                                  {event.attendees.map(a => a.name).join(', ')}
                                </div>
                              )}
                            </div>
                            <Badge variant="secondary">{getEventTypeLabel(event.type)}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <CalendarIcon class="h-12 w-12 mb-4" />
                      <p>今日暂无日程</p>
                      <Button variant="link" class="mt-2">
                        添加日程
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 移动端日程列表 */}
        <div class="lg:hidden">
          <Card>
            <CardHeader class="pb-3">
              <div class="flex items-center justify-between">
                <div>
                  <CardTitle class="text-base">
                    {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日 日程
                  </CardTitle>
                  <CardDescription>
                    {selectedEvents.length > 0
                      ? `共 ${selectedEvents.length} 个日程`
                      : '暂无日程'}
                  </CardDescription>
                </div>
                {selectedEvents.length === 0 && (
                  <Button variant="outline" size="sm">
                    添加日程
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent class="p-0">
              {selectedEvents.length > 0 ? (
                <div class="divide-y">
                  {selectedEvents.map((event) => (
                    <div
                      key={event.id}
                      class="p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div class="flex items-start gap-3">
                        <div
                          class={cn(
                            'w-0.5 h-full rounded-full mt-1 shrink-0',
                            getEventTypeColor(event.type)
                          )}
                        />
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center justify-between mb-1">
                            <h4 class="font-medium text-sm truncate">{event.title}</h4>
                            <Badge variant="secondary" class="text-xs shrink-0 ml-2">
                              {getEventTypeLabel(event.type)}
                            </Badge>
                          </div>
                          <div class="space-y-1">
                            <div class="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock class="h-3 w-3" />
                              {formatTime(event.start)} - {formatTime(event.end)}
                            </div>
                            {event.location && (
                              <div class="flex items-center gap-1 text-xs text-muted-foreground">
                                {event.location.includes('线上') ? (
                                  <Video class="h-3 w-3" />
                                ) : (
                                  <MapPin class="h-3 w-3" />
                                )}
                                <span class="truncate">{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div class="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <CalendarIcon class="h-8 w-8 mb-2" />
                  <p class="text-sm">今日暂无日程</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 即将到来的日程 */}
        <Card>
          <CardHeader>
            <CardTitle>即将到来</CardTitle>
            <CardDescription>未来的日程安排</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div class="flex items-center justify-center py-8">
                <div class="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div class="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    class="rounded-lg border p-3 sm:p-4 hover:shadow-md transition-shadow"
                  >
                    <div class="flex items-center gap-2 mb-2">
                      <div class={cn('h-2 w-2 rounded-full', getEventTypeColor(event.type))} />
                      <Badge variant="outline" class="text-xs">
                        {getDateFromEvent(event)}
                      </Badge>
                    </div>
                    <h4 class="font-medium text-sm mb-1 truncate">{event.title}</h4>
                    <p class="text-xs sm:text-sm text-muted-foreground">
                      {formatTime(event.start)} - {formatTime(event.end)}
                    </p>
                    {event.location && (
                      <p class="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <MapPin class="h-3 w-3" />
                        <span class="truncate">{event.location}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div class="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <CalendarIcon class="h-8 w-8 mb-2" />
                <p class="text-sm">暂无即将到来的日程</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default CalendarView
