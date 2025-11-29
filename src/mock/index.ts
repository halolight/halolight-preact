import Mock from 'mockjs'
import { config } from '../config/env'
import setupUserMocks from './modules/users'
import setupDashboardMocks from './modules/dashboard'
import setupMessageMocks from './modules/messages'

/**
 * 初始化 Mock 数据系统
 * 仅在 mock 模式启用时生效
 */
export function setupMock(): void {
  // 检查是否启用 Mock
  if (!config.mock) {
    console.warn('[Mock] Mock 数据已禁用')
    return
  }

  console.warn('[Mock] 正在初始化 Mock 数据系统...')

  // 配置 Mock
  Mock.setup({
    timeout: '200-600' // 模拟网络延迟
  })

  // 注册各模块的 Mock 数据
  setupUserMocks()
  setupDashboardMocks()
  setupMessageMocks()

  console.warn('[Mock] ✅ Mock 数据系统初始化完成')
  console.warn('[Mock] 已注册的模块：用户、仪表盘、消息')
}

/**
 * 重置 Mock 数据
 */
export function resetMock(): void {
  // Mock.js 没有直接的重置方法
  // 可以通过重新调用 setupMock 来重置
  setupMock()
}

/**
 * 获取 Mock 状态
 */
export function getMockStatus(): {
  enabled: boolean
  modules: string[]
} {
  return {
    enabled: config.mock,
    modules: ['users', 'dashboard', 'messages']
  }
}

// 自动初始化
if (config.mock) {
  setupMock()
}

export default setupMock
export { setupUserMocks, setupDashboardMocks, setupMessageMocks }