import Router, { route } from 'preact-router'
import { useEffect } from 'preact/hooks'
import type { JSX } from 'preact'
import { isAuthenticated } from './stores/auth'

// 认证页面
import { LoginView } from './routes/LoginView'
import { RegisterView } from './routes/RegisterView'
import { ForgotPasswordView } from './routes/ForgotPasswordView'
import { ResetPasswordView } from './routes/ResetPasswordView'

// 受保护页面
import { DashboardView } from './routes/DashboardView'
import { UsersView } from './routes/UsersView'
import { MessagesView } from './routes/MessagesView'
import { FilesView } from './routes/FilesView'
import { CalendarView } from './routes/CalendarView'
import { AnalyticsView } from './routes/AnalyticsView'
import { SecurityView } from './routes/SecurityView'
import { SettingsView } from './routes/SettingsView'

// 公开页面
import { TermsView } from './routes/TermsView'
import { PrivacyView } from './routes/PrivacyView'

// 404 页面
function NotFoundView({ path: _path }: { path?: string; default?: boolean }) {
  return (
    <div class="min-h-screen flex items-center justify-center bg-background">
      <div class="text-center">
        <h1 class="text-9xl font-bold text-primary">404</h1>
        <p class="text-xl text-muted-foreground mt-4">页面未找到</p>
        <button
          onClick={() => route('/')}
          class="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          返回首页
        </button>
      </div>
    </div>
  )
}

// 路由守卫：需要登录
interface ProtectedRouteProps {
  component: () => JSX.Element
  path: string
}

function ProtectedRoute({ component: Component }: ProtectedRouteProps) {
  useEffect(() => {
    if (!isAuthenticated.value) {
      route('/login', true)
    }
  }, [])

  if (!isAuthenticated.value) {
    return null
  }

  return <Component />
}

// 路由守卫：仅访客
interface GuestRouteProps {
  component: () => JSX.Element
  path: string
}

function GuestRoute({ component: Component }: GuestRouteProps) {
  useEffect(() => {
    if (isAuthenticated.value) {
      route('/dashboard', true)
    }
  }, [])

  if (isAuthenticated.value) {
    return null
  }

  return <Component />
}

// 公开路由（无需认证）
interface PublicRouteProps {
  component: () => JSX.Element
  path: string
}

function PublicRoute({ component: Component }: PublicRouteProps) {
  return <Component />
}

// 路由变更处理
function handleRouteChange() {
  // 滚动到顶部
  window.scrollTo(0, 0)
}

export function App() {
  return (
    <Router onChange={handleRouteChange}>
      {/* 访客路由（已登录则重定向） */}
      <GuestRoute path="/login" component={LoginView} />
      <GuestRoute path="/register" component={RegisterView} />
      <GuestRoute path="/forgot-password" component={ForgotPasswordView} />
      <GuestRoute path="/reset-password" component={ResetPasswordView} />

      {/* 公开路由（无需认证） */}
      <PublicRoute path="/terms" component={TermsView} />
      <PublicRoute path="/privacy" component={PrivacyView} />

      {/* 受保护路由（需要登录） */}
      <ProtectedRoute path="/" component={DashboardView} />
      <ProtectedRoute path="/dashboard" component={DashboardView} />
      <ProtectedRoute path="/users" component={UsersView} />
      <ProtectedRoute path="/messages" component={MessagesView} />
      <ProtectedRoute path="/files" component={FilesView} />
      <ProtectedRoute path="/calendar" component={CalendarView} />
      <ProtectedRoute path="/analytics" component={AnalyticsView} />
      <ProtectedRoute path="/security" component={SecurityView} />
      <ProtectedRoute path="/settings" component={SettingsView} />

      {/* 404 页面 */}
      <NotFoundView default />
    </Router>
  )
}
