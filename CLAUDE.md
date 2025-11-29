# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Halolight Preact 是一个基于 Preact + Vite 的轻量级中文后台管理系统，具备极小体积和高性能。

- **在线预览**: https://halolight-preact.h7ml.cn
- **GitHub**: https://github.com/halolight/halolight-preact
- **文档**: https://halolight.docs.h7ml.cn

## 技术栈速览

- **核心框架**: Preact 10 + Signals
- **构建工具**: Vite 7.2
- **路由**: preact-router
- **样式**: Tailwind CSS 3.4
- **类型**: TypeScript 5.9
- **测试**: Vitest 4.0 + Testing Library
- **代码检查**: ESLint 9 + typescript-eslint

## 常用命令

```bash
# 开发
pnpm dev          # 启动开发服务器
pnpm build        # 生产构建
pnpm preview      # 预览构建产物

# 代码质量
pnpm lint         # ESLint 检查
pnpm lint:fix     # ESLint 自动修复
pnpm type-check   # TypeScript 类型检查

# 测试
pnpm test         # 交互式测试
pnpm test:ci      # CI 测试（含覆盖率）
pnpm test:ui      # 测试 UI 界面
```

## 架构

### Preact 核心概念

```tsx
import { signal } from "@preact/signals";

// Signals: 细粒度响应式
const count = signal(0);

function Counter() {
  return (
    <button onClick={() => count.value++}>
      Count: {count}
    </button>
  );
}
```

### 目录结构

```
src/
├── app.tsx              # 应用入口
├── main.tsx             # 渲染入口
├── components/          # 可复用组件
│   ├── ui/              # UI 基础组件 (Button, Card, Input...)
│   └── common/          # 通用组件 (Header, Sidebar, Footer)
├── routes/              # 页面组件
├── layouts/             # 布局组件 (AdminLayout, AuthLayout)
├── stores/              # 状态管理
├── api/                 # API 接口
├── mock/                # Mock 数据
├── lib/                 # 工具函数
├── config/              # 配置文件
├── types/               # 类型定义
├── test/                # 测试配置
└── index.css            # 全局样式
```

### Preact vs React

- **体积更小**：3KB vs 40KB+
- **更快渲染**：更轻量的虚拟 DOM
- **兼容 React**：可使用大部分 React 生态
- **Signals**：内置细粒度响应式

### Signals 使用

```tsx
import { signal, computed, effect } from "@preact/signals";

// 创建信号
const firstName = signal("John");
const lastName = signal("Doe");

// 计算属性
const fullName = computed(() => `${firstName} ${lastName}`);

// 副作用
effect(() => {
  console.log("Name changed:", fullName.value);
});
```

### 代码规范

- **函数组件**: 使用函数组件而非类组件
- **Signals**: 优先使用 Signals 管理状态
- **类型安全**: 使用 TypeScript 进行类型检查
- **ESLint**: 遵循项目 ESLint 配置
- **测试**: 为重要组件编写测试

## 测试规范

### 测试文件位置

测试文件与源文件放在一起，使用 `.test.ts` 或 `.test.tsx` 后缀：

```
src/components/ui/
├── Button.tsx
├── Button.test.tsx     # Button 组件测试
├── Input.tsx
└── Input.test.tsx      # Input 组件测试
```

### 编写测试

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/preact'
import { Button } from './Button'

describe('Button', () => {
  it('渲染默认按钮', () => {
    render(<Button>点击</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('点击')
  })
})
```

### 运行测试

```bash
pnpm test         # 交互式测试（watch 模式）
pnpm test:ci      # CI 测试（单次运行 + 覆盖率）
pnpm test:ui      # 可视化测试界面
```

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_API_URL` | API 基础 URL | `/api` |
| `VITE_MOCK` | 启用 Mock 数据 | `true` |
| `VITE_APP_TITLE` | 应用标题 | `Admin Pro` |

## CI/CD

项目使用 GitHub Actions 进行持续集成：

- **Lint**: ESLint 代码检查
- **Type Check**: TypeScript 类型检查
- **Test**: Vitest 单元测试 + 覆盖率
- **Build**: 生产构建验证

## 新增功能开发指南

### 添加新页面

```tsx
// src/routes/Dashboard.tsx
import { signal } from "@preact/signals";
import { AdminLayout } from "../layouts/AdminLayout";

const stats = signal({ total: 0 });

export function Dashboard() {
  return (
    <AdminLayout>
      <main class="p-4">
        <h1>Dashboard</h1>
        <p>Total: {stats.value.total}</p>
      </main>
    </AdminLayout>
  );
}
```

### 添加新组件

```tsx
// src/components/ui/Badge.tsx
import { ComponentChildren } from "preact";
import { cn } from "../../lib/utils";

interface BadgeProps {
  children: ComponentChildren;
  variant?: "default" | "secondary" | "outline";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span class={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      variant === "default" && "bg-primary text-primary-foreground",
      variant === "secondary" && "bg-secondary text-secondary-foreground",
      variant === "outline" && "border border-input"
    )}>
      {children}
    </span>
  );
}
```

### 添加测试

```tsx
// src/components/ui/Badge.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/preact'
import { Badge } from './Badge'

describe('Badge', () => {
  it('渲染徽章', () => {
    render(<Badge>新</Badge>)
    expect(screen.getByText('新')).toBeInTheDocument()
  })
})
```

## 注意事项

- **class vs className**: Preact 支持 `class` 属性（React 需用 `className`）
- **事件命名**: 使用小写 `onclick`/`onClick` 均可
- **Hooks 兼容**: 支持所有 React Hooks
- **测试断言**: 使用 `@testing-library/jest-dom` 提供的断言方法
