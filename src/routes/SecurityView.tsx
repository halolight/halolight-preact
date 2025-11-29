import { useState, useEffect } from 'preact/hooks'
import { Shield, AlertTriangle, CheckCircle, XCircle, Search, Filter, Download } from 'lucide-preact'
import { AdminLayout } from '../layouts/AdminLayout'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'

interface SecurityLog {
  id: string
  action: string
  user: string
  ip: string
  status: 'success' | 'warning' | 'error'
  timestamp: string
  details?: string
}

export function SecurityView() {
  const [logs, setLogs] = useState<SecurityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setTimeout(() => {
      setLogs([
        { id: '1', action: '用户登录', user: '张三', ip: '192.168.1.100', status: 'success', timestamp: '2024-11-28 10:30:15' },
        { id: '2', action: '密码修改', user: '李四', ip: '192.168.1.101', status: 'success', timestamp: '2024-11-28 10:25:00' },
        { id: '3', action: '登录失败', user: '未知', ip: '45.33.32.156', status: 'error', timestamp: '2024-11-28 10:20:00', details: '密码错误' },
        { id: '4', action: '权限变更', user: '管理员', ip: '192.168.1.1', status: 'warning', timestamp: '2024-11-28 10:15:00', details: '提升用户权限' },
        { id: '5', action: '用户注销', user: '王五', ip: '192.168.1.102', status: 'success', timestamp: '2024-11-28 10:10:00' },
        { id: '6', action: '异常访问', user: '未知', ip: '103.224.182.252', status: 'error', timestamp: '2024-11-28 10:05:00', details: '可疑请求' },
        { id: '7', action: '数据导出', user: '赵六', ip: '192.168.1.103', status: 'warning', timestamp: '2024-11-28 10:00:00', details: '导出用户数据' },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredLogs = logs.filter(log =>
    log.action.includes(search) || log.user.includes(search) || log.ip.includes(search)
  )

  const getStatusIcon = (status: SecurityLog['status']) => {
    if (status === 'success') return <CheckCircle class="h-4 w-4 text-green-600" />
    if (status === 'warning') return <AlertTriangle class="h-4 w-4 text-orange-600" />
    return <XCircle class="h-4 w-4 text-red-600" />
  }

  const getStatusBadge = (status: SecurityLog['status']) => {
    const variants = { success: 'success', warning: 'warning', error: 'destructive' } as const
    const labels = { success: '成功', warning: '警告', error: '失败' }
    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  const stats = {
    total: logs.length,
    success: logs.filter(l => l.status === 'success').length,
    warning: logs.filter(l => l.status === 'warning').length,
    error: logs.filter(l => l.status === 'error').length,
  }

  return (
    <AdminLayout>
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold">安全审计</h1>
            <p class="text-muted-foreground mt-1">监控系统安全事件和用户活动</p>
          </div>
          <Button variant="outline">
            <Download class="h-4 w-4 mr-2" />
            导出日志
          </Button>
        </div>

        {/* 统计卡片 */}
        <div class="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent class="pt-6">
              <div class="flex items-center gap-4">
                <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield class="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">总事件</p>
                  <p class="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent class="pt-6">
              <div class="flex items-center gap-4">
                <div class="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle class="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">成功</p>
                  <p class="text-2xl font-bold">{stats.success}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent class="pt-6">
              <div class="flex items-center gap-4">
                <div class="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <AlertTriangle class="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">警告</p>
                  <p class="text-2xl font-bold">{stats.warning}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent class="pt-6">
              <div class="flex items-center gap-4">
                <div class="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle class="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">失败</p>
                  <p class="text-2xl font-bold">{stats.error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 日志列表 */}
        <Card>
          <CardHeader>
            <div class="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <CardTitle>安全日志</CardTitle>
              <div class="flex gap-2">
                <div class="relative flex-1 sm:w-64">
                  <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索日志..."
                    value={search}
                    onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
                    class="pl-9"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div class="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} class="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="border-b">
                      <th class="text-left py-3 px-4 font-medium text-muted-foreground">状态</th>
                      <th class="text-left py-3 px-4 font-medium text-muted-foreground">操作</th>
                      <th class="text-left py-3 px-4 font-medium text-muted-foreground">用户</th>
                      <th class="text-left py-3 px-4 font-medium text-muted-foreground">IP 地址</th>
                      <th class="text-left py-3 px-4 font-medium text-muted-foreground">详情</th>
                      <th class="text-left py-3 px-4 font-medium text-muted-foreground">时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log.id} class="border-b hover:bg-muted/50 transition-colors">
                        <td class="py-3 px-4">
                          <div class="flex items-center gap-2">
                            {getStatusIcon(log.status)}
                            {getStatusBadge(log.status)}
                          </div>
                        </td>
                        <td class="py-3 px-4 font-medium">{log.action}</td>
                        <td class="py-3 px-4">{log.user}</td>
                        <td class="py-3 px-4 font-mono text-sm">{log.ip}</td>
                        <td class="py-3 px-4 text-muted-foreground">{log.details || '-'}</td>
                        <td class="py-3 px-4 text-muted-foreground">{log.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default SecurityView
