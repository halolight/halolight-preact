import { config } from '../../config/env'
import { Github, BookOpen } from 'lucide-preact'

export function AppFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer class="border-t bg-background py-4 px-6">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        {/* 版权信息 */}
        <div class="flex items-center gap-1">
          <span>&copy; {currentYear}</span>
          <a
            href="https://github.com/halolight/halolight-preact"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-foreground hover:text-primary transition-colors"
          >
            {config.brandName}
          </a>
          <span>. All rights reserved.</span>
        </div>

        {/* 链接 */}
        <div class="flex items-center gap-4">
          <a
            href="https://github.com/halolight/halolight-preact"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Github class="h-4 w-4" />
            <span>GitHub</span>
          </a>
          <a
            href="https://halolight.docs.h7ml.cn"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <BookOpen class="h-4 w-4" />
            <span>在线文档</span>
          </a>
          <a
            href="/terms"
            class="hover:text-foreground transition-colors"
          >
            服务条款
          </a>
          <a
            href="/privacy"
            class="hover:text-foreground transition-colors"
          >
            隐私政策
          </a>
        </div>

        {/* 版本号 */}
        <div class="flex items-center gap-2">
          <span>v0.1.0</span>
          <span>•</span>
          <span>Powered by Preact</span>
        </div>
      </div>
    </footer>
  )
}

export default AppFooter