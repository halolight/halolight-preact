import { useState } from 'preact/hooks'
import { route } from 'preact-router'
import { Github, Mail, Lock, Eye, EyeOff, ArrowRight, MessageCircle } from 'lucide-preact'
import { AuthShell } from '../components/auth/AuthShell'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { Checkbox } from '../components/ui/Checkbox'
import { Separator } from '../components/ui/Separator'
import { login, error, loading, clearError } from '../stores/auth'
import { config } from '../config/env'
import { cn } from '../lib/utils'

export function LoginView() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [shake, setShake] = useState(false)

  // 填充演示账号
  const fillDemoAccount = () => {
    setEmail(config.demoEmail)
    setPassword(config.demoPassword)
    clearError()
  }

  const SOCIAL_LINKS = {
    github: 'https://github.com/halolight/halolight-preact',
    google: 'https://halolight-docs.h7ml.cn',
    wechat: 'https://github.com/halolight',
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    try {
      await login({ email, password })
      route('/dashboard')
    } catch {
      // 触发抖动动画
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <AuthShell title="欢迎回来" description="登录您的账户以继续">
      <Card className={cn(shake && 'animate-shake')}>
        {/* 渐变顶部边框 */}
        <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

        <CardHeader class="space-y-1">
          <CardTitle class="text-2xl text-center">登录</CardTitle>
          <CardDescription class="text-center">
            使用邮箱和密码登录您的账户
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* 社交登录 */}
          <div class="grid grid-cols-3 gap-4 mb-6">
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              class="w-full inline-flex items-center justify-center p-2 border border-input rounded-md hover:bg-accent transition-colors"
            >
              <Github class="h-5 w-5" />
            </a>
            <a
              href={SOCIAL_LINKS.google}
              target="_blank"
              rel="noopener noreferrer"
              class="w-full inline-flex items-center justify-center p-2 border border-input rounded-md hover:bg-accent transition-colors"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </a>
            <a
              href={SOCIAL_LINKS.wechat}
              target="_blank"
              rel="noopener noreferrer"
              class="w-full inline-flex items-center justify-center p-2 border border-input rounded-md hover:bg-accent transition-colors"
            >
              <MessageCircle class="h-5 w-5" />
            </a>
          </div>

          <div class="relative mb-6">
            <div class="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-card px-2 text-muted-foreground">或使用邮箱登录</span>
            </div>
          </div>

          {/* 登录表单 */}
          <form onSubmit={handleSubmit} class="space-y-4">
            <div class="space-y-2">
              <Label htmlFor="email" required>邮箱</Label>
              <div class="relative">
                <Mail class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onInput={(e) => {
                    setEmail((e.target as HTMLInputElement).value)
                    clearError()
                  }}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <Label htmlFor="password" required>密码</Label>
                <a
                  href="/forgot-password"
                  class="text-sm text-primary hover:underline"
                >
                  忘记密码？
                </a>
              </div>
              <div class="relative">
                <Lock class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onInput={(e) => {
                    setPassword((e.target as HTMLInputElement).value)
                    clearError()
                  }}
                  className="pl-9 pr-9"
                  required
                />
                <button
                  type="button"
                  class="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff class="h-4 w-4" />
                  ) : (
                    <Eye class="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* 错误提示 */}
            {error.value && (
              <div class="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error.value}
              </div>
            )}

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onChange={setRememberMe}
                />
                <Label htmlFor="remember" class="text-sm font-normal cursor-pointer">
                  记住我
                </Label>
              </div>
            </div>

            <Button type="submit" class="w-full" loading={loading.value}>
              登录
              <ArrowRight class="ml-2 h-4 w-4" />
            </Button>
          </form>

          {/* 演示账号提示 */}
          {config.showDemoHint && (
            <div class="mt-4 p-3 text-sm bg-muted rounded-md">
              <p class="text-muted-foreground mb-2">演示账号：</p>
              <p class="font-mono text-xs">邮箱：{config.demoEmail}</p>
              <p class="font-mono text-xs">密码：{config.demoPassword}</p>
              <Button
                variant="link"
                size="sm"
                class="mt-2 h-auto p-0"
                onClick={fillDemoAccount}
              >
                点击填充演示账号
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter class="flex flex-col gap-4">
          <div class="text-center text-sm text-muted-foreground">
            还没有账户？{' '}
            <a href="/register" class="text-primary hover:underline">
              立即注册
            </a>
          </div>
        </CardFooter>
      </Card>
    </AuthShell>
  )
}

export default LoginView