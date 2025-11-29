import { config } from "../config/env"
import type { ApiResponse } from "../types"

/**
 * API 客户端配置
 * 基于 fetch 的简单 HTTP 客户端
 */

const API_BASE_URL = config.apiUrl
const API_TIMEOUT = 10000 // 10 秒

/**
 * API 请求选项
 */
interface ApiRequestOptions extends RequestInit {
  timeout?: number
  params?: Record<string, string | number>
}

/**
 * API 错误类
 */
export class ApiError extends Error {
  code: number
  data?: unknown

  constructor(message: string, code: number = 500, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.data = data
  }
}

/**
 * 构建请求 URL
 */
function buildUrl(endpoint: string, params?: Record<string, string | number>): string {
  const url = new URL(endpoint, API_BASE_URL)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value))
    })
  }

  return url.toString()
}

/**
 * 获取认证头
 */
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('halolight-token')
  if (!token) return {}

  return {
    'Authorization': `Bearer ${token}`
  }
}

/**
 * 处理响应
 */
async function handleResponse<T>(response: Response): Promise<T> {
  // 检查响应状态
  if (!response.ok) {
    const errorText = await response.text()
    throw new ApiError(
      `HTTP ${response.status}: ${errorText || response.statusText}`,
      response.status
    )
  }

  // 解析响应数据
  let data: ApiResponse<T>
  try {
    data = await response.json()
  } catch {
    throw new ApiError('无效的响应格式', 500)
  }

  // 检查业务状态码
  if (data.code !== 200) {
    throw new ApiError(data.message || '请求失败', data.code, data.data)
  }

  return data.data
}

/**
 * 创建请求超时 Promise
 */
function createTimeoutPromise(timeout: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new ApiError('请求超时', 408))
    }, timeout)
  })
}

/**
 * API 请求函数
 */
async function request<T>(
  method: string,
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    timeout = API_TIMEOUT,
    params,
    headers = {},
    body,
    ...rest
  } = options

  const url = buildUrl(endpoint, params)
  const authHeaders = getAuthHeaders()

  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...headers
    },
    ...rest
  }

  // 添加请求体
  if (body) {
    requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body)
  }

  // 创建 fetch Promise
  const fetchPromise = fetch(url, requestOptions)
    .then(response => handleResponse<T>(response))

  // 添加超时控制
  return Promise.race([
    fetchPromise,
    createTimeoutPromise(timeout)
  ])
}

/**
 * GET 请求
 */
export async function get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
  return request<T>('GET', endpoint, options)
}

/**
 * POST 请求
 */
export async function post<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<T> {
  return request<T>('POST', endpoint, {
    ...options,
    body: data as BodyInit | null | undefined
  })
}

/**
 * PUT 请求
 */
export async function put<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<T> {
  return request<T>('PUT', endpoint, {
    ...options,
    body: data as BodyInit | null | undefined
  })
}

/**
 * DELETE 请求
 */
export async function del<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
  return request<T>('DELETE', endpoint, options)
}

/**
 * 上传文件
 */
export async function upload<T>(endpoint: string, file: File, options?: ApiRequestOptions): Promise<T> {
  const formData = new FormData()
  formData.append('file', file)

  return request<T>('POST', endpoint, {
    ...options,
    body: formData,
    headers: {
      ...options?.headers,
      // 不设置 Content-Type，让浏览器自动设置
    }
  })
}

/**
 * 下载文件
 */
export async function download(endpoint: string, options?: ApiRequestOptions): Promise<Blob> {
  const response = await fetch(buildUrl(endpoint, options?.params), {
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
      ...options?.headers
    }
  })

  if (!response.ok) {
    throw new ApiError(
      `HTTP ${response.status}: ${response.statusText}`,
      response.status
    )
  }

  return response.blob()
}

/**
 * 设置认证令牌
 */
export function setAuthToken(token: string): void {
  localStorage.setItem('halolight-token', token)
}

/**
 * 清除认证令牌
 */
export function clearAuthToken(): void {
  localStorage.removeItem('halolight-token')
}

/**
 * 获取认证令牌
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('halolight-token')
}

/**
 * 创建取消控制器
 */
export function createAbortController(): AbortController {
  return new AbortController()
}

export default {
  get,
  post,
  put,
  del,
  upload,
  download,
  setAuthToken,
  clearAuthToken,
  getAuthToken,
  createAbortController,
  ApiError
}