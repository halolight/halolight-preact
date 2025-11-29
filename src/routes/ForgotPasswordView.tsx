import { useState } from 'preact/hooks'
import { Mail, ArrowRight, ArrowLeft } from 'lucide-preact'
import { AuthShell } from '../components/auth/AuthShell'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'

export function ForgotPasswordView() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 模拟发送重置邮件
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess(true)
    } catch {
      setError('发送失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <AuthShell title="邮件已发送" description="请检查您的邮箱">
        <Card>
          <CardContent class="pt-6">
            <div class="text-center">
              <div class="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <Mail class="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 class="text-lg font-semibold mb-2">检查您的邮箱</h3>
              <p class="text-sm text-muted-foreground mb-4">
                我们已向 <span class="font-medium text-foreground">{email}</span> 发送了密码重置链接。
              </p>
              <p class="text-sm text-muted-foreground">
                如果没有收到邮件，请检查垃圾邮件文件夹。
              </p>
            </div>
          </CardContent>
          <CardFooter class="flex flex-col gap-4">
            <Button
              variant="outline"
              class="w-full"
              onClick={() => {
                setSuccess(false)
                setEmail('')
              }}
            >
              重新发送
            </Button>
            <a href="/login" class="text-sm text-primary hover:underline flex items-center justify-center gap-1">
              <ArrowLeft class="h-4 w-4" />
              返回登录
            </a>
          </CardFooter>
        </Card>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="忘记密码" description="输入您的邮箱以重置密码">
      <Card>
        <CardHeader class="space-y-1">
          <CardTitle class="text-2xl text-center">忘记密码</CardTitle>
          <CardDescription class="text-center">
            输入您的注册邮箱，我们将发送密码重置链接
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} class="space-y-4">
            <div class="space-y-2">
              <Label htmlFor="email" required>邮箱地址</Label>
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

            {error && (
              <div class="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" class="w-full" loading={loading}>
              发送重置链接
              <ArrowRight class="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>

        <CardFooter class="flex flex-col gap-4">
          <a href="/login" class="text-sm text-primary hover:underline flex items-center justify-center gap-1">
            <ArrowLeft class="h-4 w-4" />
            返回登录
          </a>
        </CardFooter>
      </Card>
    </AuthShell>
  )
}

export default ForgotPasswordView