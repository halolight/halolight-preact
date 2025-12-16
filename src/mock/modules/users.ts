import Mock from 'mockjs'
import type { User, Role, Permission, UserStatus } from '../../types'

const { Random } = Mock

// 权限定义
const PERMISSIONS: Permission[] = [
  { id: '1', name: '用户管理', code: 'user:manage', description: '管理用户账户' },
  { id: '2', name: '角色管理', code: 'role:manage', description: '管理用户角色' },
  { id: '3', name: '系统设置', code: 'system:settings', description: '管理系统设置' },
  { id: '4', name: '数据分析', code: 'analytics:view', description: '查看数据分析' },
  { id: '5', name: '文件管理', code: 'file:manage', description: '管理文件' },
  { id: '6', name: '消息管理', code: 'message:manage', description: '管理消息' },
]

// 角色定义
const ROLES: Role[] = [
  {
    id: '1',
    name: '超级管理员',
    permissions: PERMISSIONS,
    description: '拥有所有权限'
  },
  {
    id: '2',
    name: '管理员',
    permissions: PERMISSIONS.filter(p => p.code !== 'system:settings'),
    description: '除系统设置外的所有权限'
  },
  {
    id: '3',
    name: '编辑者',
    permissions: PERMISSIONS.filter(p => ['user:manage', 'file:manage', 'message:manage'].includes(p.code)),
    description: '用户、文件、消息管理权限'
  },
  {
    id: '4',
    name: '查看者',
    permissions: PERMISSIONS.filter(p => p.code === 'analytics:view'),
    description: '仅数据分析查看权限'
  }
]

// 生成随机用户数据
function generateUsers(count: number): User[] {
  const statuses: UserStatus[] = ['active', 'inactive', 'suspended']
  const departments = ['技术部', '市场部', '销售部', '人事部', '财务部', '运营部']
  const positions = ['经理', '主管', '专员', '助理', '工程师', '分析师']

  return Mock.mock({
    [`list|${count}`]: [{
      'id|+1': 1,
      'name': '@cname',
      'email': '@email',
      'phone': /^1[3-9]\d{9}$/,
      'avatar': '@image("100x100", "@color", "@name")',
      'role': () => Random.pick(ROLES),
      'status': () => Random.pick(statuses),
      'department': () => Random.pick(departments),
      'position': () => Random.pick(positions),
      'bio': '@csentence(10, 30)',
      'createdAt': '@datetime',
      'lastLoginAt': '@datetime'
    }]
  }).list
}

// 生成当前登录用户
function generateCurrentUser(): User {
  return {
    id: 'current',
    name: '管理员',
    email: 'admin@halolight.h7ml.cn',
    phone: '13800138000',
    avatar: Random.image('100x100', '#4F46E5', 'Admin'),
    role: ROLES[0],
    status: 'active',
    department: '技术部',
    position: '超级管理员',
    bio: '系统超级管理员，拥有所有权限',
    createdAt: '2024-01-01T00:00:00.000Z',
    lastLoginAt: new Date().toISOString()
  }
}

// Mock 接口定义
export function setupUserMocks() {
  // 获取用户列表
  Mock.mock(/\/api\/users/, 'get', (options: { url: string }) => {
    const url = new URL(options.url, 'http://localhost')
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20')
    const search = url.searchParams.get('search')
    const role = url.searchParams.get('role')
    const status = url.searchParams.get('status')

    const total = Random.integer(20, 50)
    let users = generateUsers(total)

    if (search) {
      users = users.filter(user =>
        user.name.includes(search) ||
        user.email.includes(search) ||
        user.department?.includes(search)
      )
    }

    if (role) {
      users = users.filter(user => user.role.name === role)
    }

    if (status) {
      users = users.filter(user => user.status === status)
    }

    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = users.slice(start, end)

    return {
      code: 200,
      message: '获取用户列表成功',
      data: { list, total: users.length, page, pageSize }
    }
  })

  // 获取单个用户
  Mock.mock(/\/api\/users\/\d+/, 'get', () => ({
    code: 200,
    message: '获取用户信息成功',
    data: generateUsers(1)[0]
  }))

  // 获取当前用户
  Mock.mock(/\/api\/user\/current/, 'get', () => ({
    code: 200,
    message: '获取当前用户信息成功',
    data: generateCurrentUser()
  }))

  // 用户登录
  Mock.mock(/\/api\/user\/login/, 'post', (options: { body: string }) => {
    const { email, password } = JSON.parse(options.body)

    const demoEmail = import.meta.env.VITE_DEMO_EMAIL || 'admin@halolight.h7ml.cn'
    const demoPassword = import.meta.env.VITE_DEMO_PASSWORD || '123456'

    if (email !== demoEmail || password !== demoPassword) {
      return { code: 401, message: '邮箱或密码错误', data: null }
    }

    const user = generateCurrentUser()
    return {
      code: 200,
      message: '登录成功',
      data: { user, token: 'mock-token-' + Date.now() }
    }
  })

  // 用户注册
  Mock.mock(/\/api\/user\/register/, 'post', (options: { body: string }) => {
    const userData = JSON.parse(options.body)
    const newUser = { ...generateUsers(1)[0], ...userData, id: Date.now().toString() }
    return { code: 200, message: '注册成功', data: newUser }
  })

  // 忘记密码
  Mock.mock(/\/api\/user\/forgot-password/, 'post', () => ({
    code: 200, message: '重置密码邮件已发送', data: null
  }))

  // 重置密码
  Mock.mock(/\/api\/user\/reset-password/, 'post', () => ({
    code: 200, message: '密码重置成功', data: null
  }))

  // 创建用户
  Mock.mock(/\/api\/users/, 'post', (options: { body: string }) => {
    const userData = JSON.parse(options.body)
    const newUser = {
      ...generateUsers(1)[0],
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    return { code: 200, message: '创建用户成功', data: newUser }
  })

  // 更新用户
  Mock.mock(/\/api\/users\/\d+/, 'put', (options: { body: string }) => {
    const userData = JSON.parse(options.body)
    const updatedUser = { ...generateUsers(1)[0], ...userData }
    return { code: 200, message: '更新用户成功', data: updatedUser }
  })

  // 删除用户
  Mock.mock(/\/api\/users\/\d+/, 'delete', () => ({
    code: 200, message: '删除用户成功', data: null
  }))

  // 批量删除用户
  Mock.mock(/\/api\/users\/batch-delete/, 'post', () => ({
    code: 200, message: '批量删除用户成功', data: null
  }))

  // 更新用户状态
  Mock.mock(/\/api\/users\/\d+\/status/, 'put', (options: { body: string }) => {
    const { status } = JSON.parse(options.body)
    const user = generateUsers(1)[0]
    user.status = status
    return { code: 200, message: '更新用户状态成功', data: user }
  })

  // 获取角色列表
  Mock.mock(/\/api\/roles/, 'get', () => ({
    code: 200, message: '获取角色列表成功', data: ROLES
  }))

  // 获取权限列表
  Mock.mock(/\/api\/permissions/, 'get', () => ({
    code: 200, message: '获取权限列表成功', data: PERMISSIONS
  }))
}

export { ROLES, PERMISSIONS }
export default setupUserMocks
