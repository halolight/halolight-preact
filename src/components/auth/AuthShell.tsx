import type { ComponentChildren } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { config } from '../../config/env'
import { cn } from '../../lib/utils'

interface AuthShellProps {
  children: ComponentChildren
  title?: string
  description?: string
  showLeft?: boolean
  leftContent?: ComponentChildren
  gradientClassName?: string
}

// 浮动点动画组件
function FloatingDots() {
  return (
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          class="absolute rounded-full bg-white/10 animate-pulse"
          style={{
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  )
}

// 默认左侧内容
function DefaultLeftContent() {
  const features = [
    { icon: '🚀', title: '快速部署，即刻启动', desc: '一键部署，快速上线' },
    { icon: '📊', title: '实时数据分析与可视化', desc: '强大的数据洞察能力' },
    { icon: '🔒', title: '企业级安全保障', desc: '多重安全防护机制' },
    { icon: '⚡', title: '极致性能体验', desc: '毫秒级响应速度' }
  ]

  return (
    <div class="space-y-8">
      <div>
        <h2 class="text-3xl font-bold text-white mb-4">
          欢迎使用 {config.brandName}
        </h2>
        <p class="text-white/80 text-lg">
          轻量级中文后台管理系统，基于 Preact + Vite 构建
        </p>
      </div>

      <div class="space-y-4">
        {features.map((feature, index) => (
          <div
            key={index}
            class="flex items-start gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm"
          >
            <span class="text-2xl">{feature.icon}</span>
            <div>
              <h3 class="font-semibold text-white">{feature.title}</h3>
              <p class="text-white/70 text-sm">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AuthShell({
  children,
  title,
  description,
  showLeft = true,
  leftContent,
  gradientClassName = 'from-primary via-primary/80 to-blue-600'
}: AuthShellProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div class="min-h-screen flex">
      {/* 左侧装饰区 - 仅在 lg 以上显示 */}
      {showLeft && (
        <div
          class={cn(
            'hidden lg:flex lg:w-1/2 xl:w-2/5 relative overflow-hidden',
            'bg-gradient-to-br',
            gradientClassName
          )}
        >
          {/* 网格背景 */}
          <div
            class="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />

          {/* 光晕效果 */}
          <div
            class="absolute w-96 h-96 rounded-full bg-white/20 blur-3xl"
            style={{
              left: `${mousePosition.x * 0.02}%`,
              top: `${mousePosition.y * 0.02}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />

          {/* 浮动点 */}
          <FloatingDots />

          {/* 内容 */}
          <div class="relative z-10 flex flex-col justify-center p-12 xl:p-16">
            {leftContent || <DefaultLeftContent />}
          </div>

          {/* 底部版权 */}
          <div class="absolute bottom-6 left-12 text-white/60 text-sm">
            &copy; {new Date().getFullYear()} {config.brandName}
          </div>
        </div>
      )}

      {/* 右侧表单区 */}
      <div
        class={cn(
          'flex-1 flex flex-col items-center justify-center p-6 md:p-12',
          'bg-gradient-to-br from-background via-background to-muted'
        )}
      >
        {/* Logo 和品牌 */}
        <div class="mb-8 text-center animate-fade-in">
          <div class="flex items-center justify-center gap-2 mb-2">
            <div class="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <span class="text-2xl font-bold text-primary-foreground">H</span>
            </div>
            <span class="text-2xl font-bold text-foreground">{config.brandName}</span>
          </div>
          {title && (
            <h1 class="text-xl font-semibold text-foreground mt-6">{title}</h1>
          )}
          {description && (
            <p class="text-sm text-muted-foreground mt-2">{description}</p>
          )}
        </div>

        {/* 表单内容 */}
        <div class="w-full max-w-md animate-fade-in">
          {children}
        </div>

        {/* 底部链接 */}
        <div class="mt-8 text-center text-sm text-muted-foreground space-y-2">
          <div class="flex items-center justify-center gap-4">
            <a href="/terms" class="hover:text-foreground transition-colors">
              服务条款
            </a>
            <span>•</span>
            <a href="/privacy" class="hover:text-foreground transition-colors">
              隐私政策
            </a>
            <span>•</span>
            <a
              href="https://halolight.docs.h7ml.cn/"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-foreground transition-colors"
            >
              文档
            </a>
          </div>
          <p class="lg:hidden">
            &copy; {new Date().getFullYear()} {config.brandName}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthShell
