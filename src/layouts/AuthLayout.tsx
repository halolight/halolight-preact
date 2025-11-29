import type { ComponentChildren } from 'preact'
import { config } from '../config/env'

interface AuthLayoutProps {
  children: ComponentChildren
  title?: string
  description?: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      {/* Logo 和品牌 */}
      <div class="mb-8 text-center animate-fade-in-down">
        <div class="flex items-center justify-center gap-2 mb-2">
          <div class="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <span class="text-xl font-bold text-primary-foreground">H</span>
          </div>
          <span class="text-2xl font-bold text-foreground">{config.brandName}</span>
        </div>
        {title && (
          <h1 class="text-xl font-semibold text-foreground mt-4">{title}</h1>
        )}
        {description && (
          <p class="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      {/* 内容卡片 */}
      <div class="w-full max-w-md animate-fade-in-up">
        {children}
      </div>

      {/* 底部版权 */}
      <div class="mt-8 text-center text-sm text-muted-foreground animate-fade-in">
        <p>&copy; {new Date().getFullYear()} {config.brandName}. All rights reserved.</p>
      </div>
    </div>
  )
}

export default AuthLayout