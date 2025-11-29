import { useState } from 'preact/hooks'
import { route } from 'preact-router'
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-preact'
import { AuthShell } from '../components/auth/AuthShell'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'

export function ResetPasswordView() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    if (password.length < 6) {
      setError('密码长度至少为 6 位')
      return
    }

    setLoading(true)

    try {
      // 模拟重置密码
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess(true)
    } catch {
      setError('重置失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <AuthShell title="密码已重置" description="您的密码已成功重置">
        <Card>
          <CardContent class="pt-6">
            <div class="text-center">
              <div class="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <CheckCircle class="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 class="text-lg font-semibold mb-2">密码重置成功</h3>
              <p class="text-sm text-muted-foreground mb-4">
                您的密码已成功重置，现在可以使用新密码登录了。
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button class="w-full" onClick={() => route('/login')}>
              前往登录
              <ArrowRight class="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="重置密码" description="设置您的新密码">
      <Card>
        <CardHeader class="space-y-1">
          <CardTitle class="text-2xl text-center">重置密码</CardTitle>
          <CardDescription class="text-center">
            请输入您的新密码
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} class="space-y-4">
            <div class="space-y-2">
              <Label htmlFor="password" required>新密码</Label>
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
              <Label htmlFor="confirmPassword" required>确认新密码</Label>
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

            {/* 密码强度提示 */}
            <div class="text-xs text-muted-foreground">
              密码要求：
              <ul class="list-disc list-inside mt-1">
                <li>至少 6 个字符</li>
                <li>建议包含大小写字母和数字</li>
              </ul>
            </div>

            {error && (
              <div class="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" class="w-full" loading={loading}>
              重置密码
              <ArrowRight class="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthShell>
  )
}

export default ResetPasswordView