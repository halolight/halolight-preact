import { useState, useEffect, useMemo } from 'preact/hooks'
import {
  AlertCircle,
  Mail,
  Pencil,
  Plus,
  Shield,
  Trash2,
  Search,
} from 'lucide-preact'
import { AdminLayout } from '../layouts/AdminLayout'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/Avatar'
import { cn } from '../lib/utils'

interface Role {
  id: string
  name: string
  label: string
}

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  role: Role
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  lastLoginAt?: string
}

const statusMap = {
  active: { label: '活跃', variant: 'default' as const },
  inactive: { label: '禁用', variant: 'secondary' as const },
  suspended: { label: '暂停', variant: 'outline' as const },
}

const roleColors: Record<string, string> = {
  admin: 'bg-red-500/10 text-red-500 border-red-500/20',
  manager: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  editor: 'bg-green-500/10 text-green-500 border-green-500/20',
  viewer: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
}

const roles: Role[] = [
  { id: 'admin', name: 'admin', label: '管理员' },
  { id: 'manager', name: 'manager', label: '经理' },
  { id: 'editor', name: 'editor', label: '编辑者' },
  { id: 'viewer', name: 'viewer', label: '查看者' },
]

export function UsersView() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    setTimeout(() => {
      setUsers([
        { id: '1', name: '张三', email: 'zhangsan@example.com', role: { id: 'admin', name: 'admin', label: '管理员' }, status: 'active', createdAt: '2024-01-15T10:00:00', lastLoginAt: '2024-11-28T14:30:00' },
        { id: '2', name: '李四', email: 'lisi@example.com', role: { id: 'editor', name: 'editor', label: '编辑者' }, status: 'active', createdAt: '2024-02-20T09:00:00', lastLoginAt: '2024-11-27T16:00:00' },
        { id: '3', name: '王五', email: 'wangwu@example.com', role: { id: 'viewer', name: 'viewer', label: '查看者' }, status: 'inactive', createdAt: '2024-03-10T11:00:00' },
        { id: '4', name: '赵六', email: 'zhaoliu@example.com', role: { id: 'admin', name: 'admin', label: '管理员' }, status: 'active', createdAt: '2024-04-05T08:00:00', lastLoginAt: '2024-11-26T10:00:00' },
        { id: '5', name: '钱七', email: 'qianqi@example.com', role: { id: 'manager', name: 'manager', label: '经理' }, status: 'suspended', createdAt: '2024-05-12T14:00:00', lastLoginAt: '2024-11-20T09:00:00' },
        { id: '6', name: '孙八', email: 'sunba@example.com', role: { id: 'editor', name: 'editor', label: '编辑者' }, status: 'active', createdAt: '2024-06-18T10:00:00', lastLoginAt: '2024-11-25T11:00:00' },
        { id: '7', name: '周九', email: 'zhoujiu@example.com', role: { id: 'viewer', name: 'viewer', label: '查看者' }, status: 'active', createdAt: '2024-07-22T09:00:00', lastLoginAt: '2024-11-24T15:00:00' },
        { id: '8', name: '吴十', email: 'wushi@example.com', role: { id: 'editor', name: 'editor', label: '编辑者' }, status: 'inactive', createdAt: '2024-08-30T11:00:00' },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || user.status === statusFilter
      const matchRole = roleFilter === 'all' || user.role.id === roleFilter
      return matchSearch && matchStatus && matchRole
    })
  }, [users, search, statusFilter, roleFilter])

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    suspended: users.filter(u => u.status === 'suspended').length,
  }), [users])

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id))
  }

  return (
    <AdminLayout>
      <div class="space-y-6">
        {/* 页面标题 */}
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">用户管理</h1>
          </div>
          <Button>
            <Plus class="mr-2 h-4 w-4" />
            添加用户
          </Button>
        </div>

        {/* 统计卡片 */}
        <div class="grid gap-4 md:grid-cols-4">
          {[
            { label: '总用户数', value: stats.total, color: 'text-blue-500' },
            { label: '活跃用户', value: stats.active, color: 'text-green-500' },
            { label: '已禁用', value: stats.inactive, color: 'text-yellow-500' },
            { label: '暂停中', value: stats.suspended, color: 'text-red-500' },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardHeader class="pb-2">
                <CardDescription>{stat.label}</CardDescription>
              </CardHeader>
              <CardContent>
                <p class={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 筛选区域 */}
        <Card>
          <CardContent class="pt-6">
            <div class="flex flex-wrap gap-4">
              <div class="flex-1 min-w-[200px]">
                <div class="relative">
                  <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="搜索用户..."
                    value={search}
                    onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
                    class="pl-10"
                  />
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter((e.target as HTMLSelectElement).value)}
                class="flex h-10 w-[140px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="all">全部状态</option>
                <option value="active">活跃</option>
                <option value="inactive">禁用</option>
                <option value="suspended">暂停</option>
              </select>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter((e.target as HTMLSelectElement).value)}
                class="flex h-10 w-[140px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="all">全部角色</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.label}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* 用户表格 */}
        <Card>
          <CardHeader>
            <CardTitle>用户列表</CardTitle>
            <CardDescription>查看和管理所有系统用户</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div class="flex items-center justify-center py-8">
                <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : (
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="border-b">
                      <th class="text-left py-3 px-4 font-medium text-muted-foreground">用户</th>
                      <th class="text-left py-3 px-4 font-medium text-muted-foreground">角色</th>
                      <th class="text-left py-3 px-4 font-medium text-muted-foreground">状态</th>
                      <th class="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">注册时间</th>
                      <th class="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">最后登录</th>
                      <th class="text-right py-3 px-4 font-medium text-muted-foreground">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} class="border-b hover:bg-muted/50 transition-colors">
                        <td class="py-3 px-4">
                          <div class="flex items-center gap-3">
                            <Avatar class="h-8 w-8">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p class="font-medium">{user.name}</p>
                              <p class="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td class="py-3 px-4">
                          <Badge variant="outline" class={roleColors[user.role.id] || ''}>
                            <Shield class="mr-1 h-3 w-3" />
                            {user.role.label}
                          </Badge>
                        </td>
                        <td class="py-3 px-4">
                          <Badge variant={statusMap[user.status].variant}>
                            {statusMap[user.status].label}
                          </Badge>
                        </td>
                        <td class="py-3 px-4 hidden md:table-cell text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                        </td>
                        <td class="py-3 px-4 hidden lg:table-cell text-muted-foreground">
                          {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('zh-CN') : '-'}
                        </td>
                        <td class="py-3 px-4 text-right">
                          <div class="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" title="编辑">
                              <Pencil class="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="发送邮件">
                              <Mail class="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="删除"
                              class="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(user.id)}
                            >
                              <Trash2 class="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={6} class="py-8 text-center text-muted-foreground">
                          <AlertCircle class="h-8 w-8 mx-auto mb-2" />
                          <p>没有找到匹配的用户</p>
                        </td>
                      </tr>
                    )}
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

export default UsersView
