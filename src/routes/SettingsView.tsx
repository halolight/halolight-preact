import { useState } from 'preact/hooks'
import { User, Bell, Shield, Palette, Globe, Save } from 'lucide-preact'
import { AdminLayout } from '../layouts/AdminLayout'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { Switch } from '../components/ui/Switch'
import { Separator } from '../components/ui/Separator'
import { cn } from '../lib/utils'

type SettingsTab = 'profile' | 'notifications' | 'security' | 'appearance' | 'language'

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [saving, setSaving] = useState(false)

  const tabs = [
    { id: 'profile' as const, label: '个人资料', icon: User },
    { id: 'notifications' as const, label: '通知设置', icon: Bell },
    { id: 'security' as const, label: '安全设置', icon: Shield },
    { id: 'appearance' as const, label: '外观设置', icon: Palette },
    { id: 'language' as const, label: '语言与地区', icon: Globe },
  ]

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => setSaving(false), 1000)
  }

  return (
    <AdminLayout>
      <div class="space-y-6">
        <div>
          <h1 class="text-3xl font-bold">系统设置</h1>
          <p class="text-muted-foreground mt-1">管理您的账户设置和偏好</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 侧边导航 */}
          <Card class="lg:col-span-1 h-fit">
            <CardContent class="p-2">
              <nav class="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      class={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors',
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      )}
                    >
                      <Icon class="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>

          {/* 设置内容 */}
          <div class="lg:col-span-3 space-y-6">
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle>个人资料</CardTitle>
                  <CardDescription>更新您的个人信息</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <Label>姓名</Label>
                      <Input defaultValue="管理员" />
                    </div>
                    <div class="space-y-2">
                      <Label>邮箱</Label>
                      <Input type="email" defaultValue="admin@halolight.h7ml.cn" />
                    </div>
                    <div class="space-y-2">
                      <Label>手机号</Label>
                      <Input type="tel" defaultValue="13800138000" />
                    </div>
                    <div class="space-y-2">
                      <Label>部门</Label>
                      <Input defaultValue="技术部" />
                    </div>
                  </div>
                  <div class="space-y-2">
                    <Label>个人简介</Label>
                    <textarea
                      class="w-full min-h-24 px-3 py-2 rounded-md border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                      defaultValue="系统管理员，负责系统的日常维护和管理工作。"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle>通知设置</CardTitle>
                  <CardDescription>配置您的通知偏好</CardDescription>
                </CardHeader>
                <CardContent class="space-y-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">邮件通知</p>
                      <p class="text-sm text-muted-foreground">接收重要更新的邮件通知</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">推送通知</p>
                      <p class="text-sm text-muted-foreground">接收浏览器推送通知</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">消息提醒</p>
                      <p class="text-sm text-muted-foreground">新消息时显示桌面通知</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">系统公告</p>
                      <p class="text-sm text-muted-foreground">接收系统公告和更新通知</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle>安全设置</CardTitle>
                  <CardDescription>管理您的账户安全</CardDescription>
                </CardHeader>
                <CardContent class="space-y-6">
                  <div class="space-y-4">
                    <div>
                      <p class="font-medium">修改密码</p>
                      <p class="text-sm text-muted-foreground mb-4">定期更改密码以保护账户安全</p>
                      <div class="grid gap-4 max-w-sm">
                        <Input type="password" placeholder="当前密码" />
                        <Input type="password" placeholder="新密码" />
                        <Input type="password" placeholder="确认新密码" />
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">两步验证</p>
                      <p class="text-sm text-muted-foreground">添加额外的安全层</p>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">登录提醒</p>
                      <p class="text-sm text-muted-foreground">异地登录时发送提醒</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'appearance' && (
              <Card>
                <CardHeader>
                  <CardTitle>外观设置</CardTitle>
                  <CardDescription>自定义界面外观</CardDescription>
                </CardHeader>
                <CardContent class="space-y-6">
                  <div>
                    <p class="font-medium mb-4">主题模式</p>
                    <div class="grid grid-cols-3 gap-4">
                      {['light', 'dark', 'system'].map((theme) => (
                        <button
                          key={theme}
                          class={cn(
                            'p-4 rounded-lg border-2 text-center transition-colors',
                            theme === 'light' && 'border-primary bg-primary/5'
                          )}
                        >
                          <div class={cn(
                            'h-12 rounded-md mb-2',
                            theme === 'light' && 'bg-white border',
                            theme === 'dark' && 'bg-gray-900',
                            theme === 'system' && 'bg-gradient-to-r from-white to-gray-900'
                          )} />
                          <p class="text-sm font-medium">
                            {theme === 'light' ? '浅色' : theme === 'dark' ? '深色' : '跟随系统'}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">紧凑模式</p>
                      <p class="text-sm text-muted-foreground">减少界面元素间距</p>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">显示页脚</p>
                      <p class="text-sm text-muted-foreground">在页面底部显示页脚信息</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'language' && (
              <Card>
                <CardHeader>
                  <CardTitle>语言与地区</CardTitle>
                  <CardDescription>设置语言和地区偏好</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="space-y-2">
                    <Label>界面语言</Label>
                    <select class="w-full px-3 py-2 rounded-md border bg-background">
                      <option value="zh-CN">简体中文</option>
                      <option value="zh-TW">繁體中文</option>
                      <option value="en-US">English (US)</option>
                      <option value="ja-JP">日本語</option>
                    </select>
                  </div>
                  <div class="space-y-2">
                    <Label>时区</Label>
                    <select class="w-full px-3 py-2 rounded-md border bg-background">
                      <option value="Asia/Shanghai">亚洲/上海 (GMT+8)</option>
                      <option value="Asia/Tokyo">亚洲/东京 (GMT+9)</option>
                      <option value="America/New_York">美洲/纽约 (GMT-5)</option>
                      <option value="Europe/London">欧洲/伦敦 (GMT+0)</option>
                    </select>
                  </div>
                  <div class="space-y-2">
                    <Label>日期格式</Label>
                    <select class="w-full px-3 py-2 rounded-md border bg-background">
                      <option value="YYYY-MM-DD">2024-11-28</option>
                      <option value="MM/DD/YYYY">11/28/2024</option>
                      <option value="DD/MM/YYYY">28/11/2024</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 保存按钮 */}
            <div class="flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                <Save class="h-4 w-4 mr-2" />
                {saving ? '保存中...' : '保存设置'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default SettingsView
