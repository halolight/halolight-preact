import { signal, computed } from "@preact/signals"
import { config } from "../config/env"
import type { User, LoginCredentials } from "../types"
import { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem } from "../lib/utils"

// 认证状态信号
export const user = signal<User | null>(getLocalStorageItem('halolight-user', null))
export const token = signal<string>(getLocalStorageItem('halolight-token', ''))
export const loading = signal<boolean>(false)
export const error = signal<string>('')

// 计算信号
export const isAuthenticated = computed(() => Boolean(token.value))
export const initials = computed(() => {
  if (!user.value) return 'HL'
  return user.value.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
})

/**
 * 登录
 */
export async function login(credentials: LoginCredentials): Promise<User> {
  loading.value = true
  error.value = ''

  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 600))

    // 模拟验证（从环境变量读取演示账号）
    const demoEmail = config.demoEmail
    const demoPassword = config.demoPassword

    if (credentials.email !== demoEmail || credentials.password !== demoPassword) {
      throw new Error('邮箱或密码错误')
    }

    const userData: User = {
      id: '1',
      name: config.brandName + ' Admin',
      email: credentials.email,
      role: {
        id: '1',
        name: 'Administrator',
        permissions: [],
        description: '系统管理员'
      },
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    }

    user.value = userData
    token.value = 'mock-token-' + Date.now()

    // 持久化到 localStorage
    setLocalStorageItem('halolight-user', userData)
    setLocalStorageItem('halolight-token', token.value)

    return userData
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : '登录失败'
    error.value = errorMessage
    throw e
  } finally {
    loading.value = false
  }
}

/**
 * 登出
 */
export function logout(): void {
  user.value = null
  token.value = ''
  error.value = ''

  // 清除 localStorage
  removeLocalStorageItem('halolight-user')
  removeLocalStorageItem('halolight-token')
}

/**
 * 清除错误
 */
export function clearError(): void {
  error.value = ''
}

/**
 * 检查认证状态
 */
export function checkAuth(): boolean {
  return isAuthenticated.value && user.value !== null
}

/**
 * 获取当前用户信息
 */
export function getCurrentUser(): User | null {
  return user.value
}

/**
 * 获取认证令牌
 */
export function getToken(): string {
  return token.value
}

/**
 * 初始化认证状态
 */
export function initAuth(): void {
  const storedUser = getLocalStorageItem('halolight-user', null)
  const storedToken = getLocalStorageItem('halolight-token', '')

  if (storedUser && storedToken) {
    user.value = storedUser
    token.value = storedToken
  }
}