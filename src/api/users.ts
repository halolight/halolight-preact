import { get, post, put, del } from "./client"
import type { User, PaginatedResponse, LoginCredentials, RegisterData, ResetPasswordData, Role, Permission } from "../types"

/**
 * 获取用户列表
 */
export async function fetchUsers(params?: {
  page?: number
  pageSize?: number
  search?: string
  role?: string
  status?: string
}): Promise<PaginatedResponse<User>> {
  return get("/users", { params })
}

/**
 * 获取单个用户
 */
export async function fetchUser(id: string): Promise<User> {
  return get(`/users/${id}`)
}

/**
 * 获取当前用户
 */
export async function fetchCurrentUser(): Promise<User> {
  return get("/user/current")
}

/**
 * 用户登录
 */
export async function loginUser(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
  return post("/user/login", credentials)
}

/**
 * 用户注册
 */
export async function registerUser(data: RegisterData): Promise<User> {
  return post("/user/register", data)
}

/**
 * 忘记密码
 */
export async function forgotPassword(email: string): Promise<void> {
  return post("/user/forgot-password", { email })
}

/**
 * 重置密码
 */
export async function resetPassword(data: ResetPasswordData): Promise<void> {
  return post("/user/reset-password", data)
}

/**
 * 创建用户
 */
export async function createUser(data: Partial<User>): Promise<User> {
  return post("/users", data)
}

/**
 * 更新用户
 */
export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  return put(`/users/${id}`, data)
}

/**
 * 删除用户
 */
export async function deleteUser(id: string): Promise<void> {
  return del(`/users/${id}`)
}

/**
 * 批量删除用户
 */
export async function deleteUsers(ids: string[]): Promise<void> {
  return post("/users/batch-delete", { ids })
}

/**
 * 更新用户状态
 */
export async function updateUserStatus(id: string, status: string): Promise<User> {
  return put(`/users/${id}/status`, { status })
}

/**
 * 获取角色列表
 */
export async function fetchRoles(): Promise<Role[]> {
  return get("/roles")
}

/**
 * 获取权限列表
 */
export async function fetchPermissions(): Promise<Permission[]> {
  return get("/permissions")
}