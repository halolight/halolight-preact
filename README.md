# Halolight Preact | Admin Pro

[![CI](https://github.com/halolight/halolight-preact/actions/workflows/ci.yml/badge.svg)](https://github.com/halolight/halolight-preact/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/halolight/halolight-preact/blob/main/LICENSE)
[![Preact](https://img.shields.io/badge/Preact-10-%23673AB8.svg)](https://preactjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-%233178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-%2306B6D4.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-4.0-%236E9F18.svg)](https://vitest.dev/)

基于 Preact + Vite 的轻量级中文后台管理系统，具备极小体积、Signals 响应式和高性能。

- 在线预览：<https://halolight-preact.h7ml.cn>
- GitHub：<https://github.com/halolight/halolight-preact>
- 文档：<https://halolight.docs.h7ml.cn>

## 功能亮点

- **极小体积**：Preact 仅 3KB，远小于 React
- **Signals**：内置细粒度响应式状态管理
- **React 兼容**：可使用大部分 React 生态库
- **TypeScript**：完整类型安全支持
- **Vite 构建**：极速开发体验
- **Tailwind CSS**：原子化样式
- **完整测试**：Vitest + Testing Library

## 目录结构

```
src/
├── app.tsx              # 应用入口
├── main.tsx             # 渲染入口
├── components/          # 可复用组件
│   ├── ui/              # UI 基础组件
│   └── common/          # 通用组件
├── routes/              # 页面组件
├── layouts/             # 布局组件
├── stores/              # 状态管理
├── api/                 # API 接口
├── mock/                # Mock 数据
├── lib/                 # 工具函数
├── config/              # 配置文件
├── types/               # 类型定义
├── test/                # 测试配置
└── index.css            # 全局样式
```

## 快速开始

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 生产构建
pnpm build

# 预览构建产物
pnpm preview
```

## 开发命令

```bash
# 代码检查
pnpm lint          # ESLint 检查
pnpm lint:fix      # ESLint 自动修复

# 类型检查
pnpm type-check    # TypeScript 类型检查

# 测试
pnpm test          # 交互式测试
pnpm test:ci       # CI 测试（含覆盖率）
pnpm test:ui       # 测试 UI 界面
```

## 技术栈

| 类别 | 技术 |
|------|------|
| 核心框架 | Preact 10 + Signals |
| 类型系统 | TypeScript 5.9 |
| 构建工具 | Vite 7.2 |
| 样式 | Tailwind CSS 3.4 |
| 路由 | preact-router |
| 测试 | Vitest + Testing Library |
| 代码检查 | ESLint 9 + typescript-eslint |

## 为什么选择 Preact

- **极小体积**：3KB gzipped，对比 React 40KB+
- **Signals**：细粒度响应式，性能更优
- **React 兼容**：preact/compat 提供完整兼容层
- **快速渲染**：更轻量的虚拟 DOM 实现

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_API_URL` | API 基础 URL | `/api` |
| `VITE_MOCK` | 启用 Mock 数据 | `true` |
| `VITE_APP_TITLE` | 应用标题 | `Admin Pro` |

## CI/CD

项目使用 GitHub Actions 进行持续集成：

- **Lint**：ESLint 代码检查
- **Type Check**：TypeScript 类型检查
- **Test**：Vitest 单元测试 + 覆盖率报告
- **Build**：生产构建验证

## 许可证

[MIT](LICENSE)
