import { useState } from 'preact/hooks'
import { route } from 'preact-router'
import { Github, Mail, Lock, Eye, EyeOff, User, ArrowRight, Phone } from 'lucide-preact'
import { AuthShell } from '../components/auth/AuthShell'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { Checkbox } from '../components/ui/Checkbox'
import { Separator } from '../components/ui/Separator'

const SOCIAL_LINKS = {
  github: 'https://github.com/halolight/halolight-preact',
  google: 'https://halolight-docs.h7ml.cn',
  wechat: 'https://github.com/halolight',
}

export function RegisterView() {
  // Read registration enabled flag from environment variable (default: false)
  const registrationEnabled = import.meta.env.VITE_ENABLE_REGISTRATION === 'true'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setError('')

    // 验证
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    if (password.length < 6) {
      setError('密码长度至少为 6 位')
      return
    }

    if (!agreeTerms) {
      setError('请阅读并同意服务条款和隐私政策')
      return
    }

    setLoading(true)

    try {
      // 模拟注册
      await new Promise(resolve => setTimeout(resolve, 1000))
      route('/login')
    } catch {
      setError('注册失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="创建账户" description="注册新账户以开始使用">
      <Card>
        <CardHeader class="space-y-1">
          <CardTitle class="text-2xl text-center">注册</CardTitle>
          <CardDescription class="text-center">
            创建您的账户以开始使用
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!registrationEnabled ? (
            <div class="space-y-6 py-6">
              {/* Main lock icon and title */}
              <div class="flex flex-col items-center justify-center space-y-4">
                <div class="relative">
                  <div class="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
                    <Lock class="h-10 w-10 text-amber-600 dark:text-amber-500" />
                  </div>
                  <div
                    class="absolute -inset-2 rounded-full border-2 border-dashed border-amber-300/50 dark:border-amber-700/50"
                    style={{
                      animation: 'spin 20s linear infinite'
                    }}
                  />
                </div>

                <div class="space-y-2 text-center">
                  <h3 class="text-xl font-semibold text-foreground sm:text-2xl">
                    注册已关闭
                  </h3>
                  <p class="max-w-sm text-sm text-muted-foreground">
                    系统管理员已暂时关闭新用户注册功能
                  </p>
                </div>
              </div>

              {/* Info cards */}
              <div class="space-y-3">
                <div class="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/50 p-4 backdrop-blur-sm transition-colors hover:border-primary/20 hover:bg-muted/80">
                  <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Mail class="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div class="flex-1 space-y-1">
                    <p class="text-sm font-medium text-foreground">联系管理员</p>
                    <p class="text-xs text-muted-foreground">
                      如需创建账号，请通过邮件联系系统管理员
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/50 p-4 backdrop-blur-sm transition-colors hover:border-primary/20 hover:bg-muted/80">
                  <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Phone class="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div class="flex-1 space-y-1">
                    <p class="text-sm font-medium text-foreground">已有账号？</p>
                    <p class="text-xs text-muted-foreground">
                      如果您已有账号，请直接登录使用系统功能
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative separator */}
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-border/50" />
                </div>
                <div class="relative flex justify-center">
                  <span class="bg-card px-4 text-xs text-muted-foreground">
                    感谢您的理解
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <>
          {/* 社交登录 */}
          <div class="grid grid-cols-2 gap-4 mb-6">
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center px-4 py-2 border border-input rounded-md hover:bg-accent transition-colors"
            >
              <Github class="mr-2 h-4 w-4" />
              GitHub
            </a>
            <a
              href={SOCIAL_LINKS.google}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center px-4 py-2 border border-input rounded-md hover:bg-accent transition-colors"
            >
              <svg class="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </a>
          </div>

          <div class="relative mb-6">
            <div class="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-card px-2 text-muted-foreground">或使用邮箱注册</span>
            </div>
          </div>

          {/* 注册表单 */}
          <form onSubmit={handleSubmit} class="space-y-4">
            <div class="space-y-2">
              <Label htmlFor="name" required>姓名</Label>
              <div class="relative">
                <User class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="您的姓名"
                  value={name}
                  onInput={(e) => setName((e.target as HTMLInputElement).value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label htmlFor="email" required>邮箱</Label>
              <div class="relative">
                <Mail class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label htmlFor="password" required>密码</Label>
              <div class="relative">
                <Lock class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                  className="pl-9 pr-9"
                  required
                />
                <button
                  type="button"
                  class="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff class="h-4 w-4" /> : <Eye class="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div class="space-y-2">
              <Label htmlFor="confirmPassword" required>确认密码</Label>
              <div class="relative">
                <Lock class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onInput={(e) => setConfirmPassword((e.target as HTMLInputElement).value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            {error && (
              <div class="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}

            <div class="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onChange={setAgreeTerms}
              />
              <Label htmlFor="terms" class="text-sm font-normal cursor-pointer leading-relaxed">
                我已阅读并同意{' '}
                <a href="/terms" class="text-primary hover:underline">服务条款</a>
                {' '}和{' '}
                <a href="/privacy" class="text-primary hover:underline">隐私政策</a>
              </Label>
            </div>

            <Button type="submit" class="w-full" loading={loading}>
              注册
              <ArrowRight class="ml-2 h-4 w-4" />
            </Button>
          </form>
            </>
          )}
        </CardContent>

        <CardFooter class="flex flex-col gap-4">
          {registrationEnabled ? (
            <div class="text-center text-sm text-muted-foreground">
              已有账户？{' '}
              <a href="/login" class="text-primary hover:underline">
                立即登录
              </a>
            </div>
          ) : (
            <div class="w-full space-y-3">
              <a href="/login" class="block w-full">
                <Button
                  variant="default"
                  class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  <span class="inline-flex items-center gap-2">
                    ← 返回登录
                  </span>
                </Button>
              </a>
              <p class="text-center text-xs text-muted-foreground">使用现有账号登录系统</p>
            </div>
          )}
        </CardFooter>
      </Card>
    </AuthShell>
  )
}

export default RegisterView