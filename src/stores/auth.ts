import { signal, computed } from "@preact/signals"
import { config } from "../config/env"
import type { User, LoginCredentials } from "../types"
import { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem } from "../lib/utils"

// 扩展用户类型以支持多账号
export interface AccountWithToken extends User {
  token: string
}

// 认证状态信号
export const user = signal<User | null>(getLocalStorageItem('halolight-user', null))
export const token = signal<string>(getLocalStorageItem('halolight-token', ''))
export const accounts = signal<AccountWithToken[]>(getLocalStorageItem('halolight-accounts', []))
export const activeAccountId = signal<string | null>(getLocalStorageItem('halolight-active-account-id', null))
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

    const accountToken = 'mock-token-' + Date.now()

    // 创建账号数据
    const accountData: AccountWithToken = {
      ...userData,
      token: accountToken
    }

    // 检查是否已存在该账号
    const existingAccountIndex = accounts.value.findIndex(acc => acc.email === accountData.email)
    let updatedAccounts: AccountWithToken[]

    if (existingAccountIndex >= 0) {
      // 更新现有账号
      updatedAccounts = [...accounts.value]
      updatedAccounts[existingAccountIndex] = accountData
    } else {
      // 添加新账号
      updatedAccounts = [...accounts.value, accountData]
    }

    user.value = userData
    token.value = accountToken
    accounts.value = updatedAccounts
    activeAccountId.value = userData.id

    // 持久化到 localStorage
    setLocalStorageItem('halolight-user', userData)
    setLocalStorageItem('halolight-token', accountToken)
    setLocalStorageItem('halolight-accounts', updatedAccounts)
    setLocalStorageItem('halolight-active-account-id', userData.id)

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
  activeAccountId.value = null
  error.value = ''

  // 清除 localStorage
  removeLocalStorageItem('halolight-user')
  removeLocalStorageItem('halolight-token')
  removeLocalStorageItem('halolight-active-account-id')
  // 保留 accounts 以便快速切换
}

/**
 * 切换账号
 */
export async function switchAccount(accountId: string): Promise<void> {
  loading.value = true
  error.value = ''

  try {
    const account = accounts.value.find(acc => acc.id === accountId)
    if (!account) {
      throw new Error('账号不存在')
    }

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))

    // 更新当前用户和令牌
    const { token: accountToken, ...userData } = account
    user.value = userData
    token.value = accountToken
    activeAccountId.value = accountId

    // 持久化到 localStorage
    setLocalStorageItem('halolight-user', userData)
    setLocalStorageItem('halolight-token', accountToken)
    setLocalStorageItem('halolight-active-account-id', accountId)
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : '切换账号失败'
    error.value = errorMessage
    throw e
  } finally {
    loading.value = false
  }
}

/**
 * 加载所有账号
 */
export async function loadAccounts(): Promise<AccountWithToken[]> {
  loading.value = true

  try {
    // 模拟从服务器加载账号列表
    await new Promise(resolve => setTimeout(resolve, 300))

    // 从 localStorage 读取
    const storedAccounts = getLocalStorageItem<AccountWithToken[]>('halolight-accounts', [])
    accounts.value = storedAccounts

    return storedAccounts
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : '加载账号失败'
    error.value = errorMessage
    return []
  } finally {
    loading.value = false
  }
}

/**
 * 移除账号
 */
export function removeAccount(accountId: string): void {
  const updatedAccounts = accounts.value.filter(acc => acc.id !== accountId)
  accounts.value = updatedAccounts
  setLocalStorageItem('halolight-accounts', updatedAccounts)

  // 如果移除的是当前活动账号，需要登出
  if (activeAccountId.value === accountId) {
    logout()
  }
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
  const storedAccounts = getLocalStorageItem<AccountWithToken[]>('halolight-accounts', [])
  const storedActiveAccountId = getLocalStorageItem<string | null>('halolight-active-account-id', null)

  if (storedUser && storedToken) {
    user.value = storedUser
    token.value = storedToken
    accounts.value = storedAccounts
    activeAccountId.value = storedActiveAccountId
  }
}