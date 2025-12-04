import { useMemo } from 'preact/hooks'

interface TasksWidgetProps {
  isMobile?: boolean
}

interface Task {
  id: number
  title: string
  status: 'pending' | 'in_progress' | 'completed'
  priority?: 'low' | 'medium' | 'high'
}

// Mock tasks data - in real app this would come from the store
const mockTasks: Task[] = [
  { id: 1, title: '完成项目文档', status: 'in_progress', priority: 'high' },
  { id: 2, title: '代码审查', status: 'pending', priority: 'medium' },
  { id: 3, title: '修复 Bug #123', status: 'in_progress', priority: 'high' },
  { id: 4, title: '更新依赖包', status: 'pending', priority: 'low' },
  { id: 5, title: '编写测试用例', status: 'completed', priority: 'medium' },
  { id: 6, title: '性能优化', status: 'pending', priority: 'medium' }
]

export function TasksWidget({ isMobile }: TasksWidgetProps) {
  const tasks = useMemo(() => mockTasks, [])

  const displayTasks = isMobile ? tasks.slice(0, 3) : tasks

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'in_progress':
        return '进行中'
      case 'completed':
        return '已完成'
      case 'pending':
      default:
        return '待处理'
    }
  }

  const getStatusClass = (status: Task['status']) => {
    switch (status) {
      case 'in_progress':
        return 'bg-primary text-primary-foreground'
      case 'completed':
        return 'bg-muted text-muted-foreground'
      case 'pending':
      default:
        return 'bg-secondary text-secondary-foreground'
    }
  }

  const getPriorityColor = (priority?: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-destructive'
      case 'medium':
        return 'text-primary'
      case 'low':
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div class="space-y-3">
      {displayTasks.map((task) => (
        <div key={task.id} class="flex items-center gap-3">
          <div class={`h-2 w-2 rounded-full shrink-0 ${getPriorityColor(task.priority)}`} />
          <span class="text-sm flex-1 truncate">{task.title}</span>
          <span
            class={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${getStatusClass(task.status)}`}
          >
            {getStatusText(task.status)}
          </span>
        </div>
      ))}
    </div>
  )
}
