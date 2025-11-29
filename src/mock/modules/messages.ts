import Mock from 'mockjs'
import type { Message, Conversation } from '../../types'

const { Random } = Mock

// 生成消息数据
function generateMessages(count: number, conversationId: string): Message[] {
  const userNames = ['张三', '李四', '王五', '赵六', '钱七', '孙八']

  return Mock.mock({
    [`list|${count}`]: [{
      'id|+1': 1,
      'sender': {
        'id|+1': 1,
        'name': () => Random.pick(userNames),
        'email': '@email',
        'avatar': '@image("100x100", "@color", "@name")',
        'role': {
          'id': '1',
          'name': '用户',
          'permissions': [],
          'description': '普通用户'
        },
        'status': 'active',
        'createdAt': '@datetime'
      },
      'content': '@csentence(10, 50)',
      'timestamp': '@datetime',
      'read': () => Random.boolean(),
      'conversationId': conversationId
    }]
  }).list
}

// 生成对话数据
function generateConversations(count: number): Conversation[] {
  const userNames = ['张三', '李四', '王五', '赵六', '钱七', '孙八']

  return Mock.mock({
    [`list|${count}`]: [{
      'id|+1': 1,
      'participants': [
        {
          'id': 'current',
          'name': '当前用户',
          'email': 'current@example.com',
          'avatar': '@image("100x100", "#4F46E5", "Current")',
          'role': {
            'id': '1',
            'name': '管理员',
            'permissions': [],
            'description': '系统管理员'
          },
          'status': 'active',
          'createdAt': '@datetime'
        },
        {
          'id|+1': 10,
          'name': () => Random.pick(userNames),
          'email': '@email',
          'avatar': '@image("100x100", "@color", "@name")',
          'role': {
            'id': '2',
            'name': '用户',
            'permissions': [],
            'description': '普通用户'
          },
          'status': 'active',
          'createdAt': '@datetime'
        }
      ],
      'lastMessage': {
        'id|+1': 1,
        'sender': {
          'id|+1': 10,
          'name': () => Random.pick(userNames),
          'email': '@email',
          'avatar': '@image("100x100", "@color", "@name")',
          'role': {
            'id': '2',
            'name': '用户',
            'permissions': [],
            'description': '普通用户'
          },
          'status': 'active',
          'createdAt': '@datetime'
        },
        'content': '@csentence(10, 30)',
        'timestamp': '@datetime',
        'read': () => Random.boolean(),
        'conversationId': '@id'
      },
      'unreadCount': () => Random.integer(0, 10),
      'updatedAt': '@datetime'
    }]
  }).list
}

// 生成通知消息
function generateNotifications(count: number): Message[] {
  const contents = [
    '您的订单已发货，请注意查收',
    '系统将于今晚进行维护升级',
    '新用户注册成功，欢迎加入',
    '检测到异常登录行为，请注意账户安全',
    '限时优惠活动即将开始'
  ]

  return Mock.mock({
    [`list|${count}`]: [{
      'id|+1': 1,
      'sender': {
        'id': 'system',
        'name': '系统通知',
        'email': 'system@example.com',
        'avatar': '@image("100x100", "#6B7280", "System")',
        'role': {
          'id': '0',
          'name': '系统',
          'permissions': [],
          'description': '系统通知'
        },
        'status': 'active',
        'createdAt': '@datetime'
      },
      'content': () => Random.pick(contents),
      'timestamp': '@datetime',
      'read': () => Random.boolean(),
      'conversationId': 'notifications'
    }]
  }).list
}

// Mock 接口定义
export function setupMessageMocks() {
  // 获取对话列表
  Mock.mock(/\/api\/conversations/, 'get', () => ({
    code: 200,
    message: '获取对话列表成功',
    data: generateConversations(8)
  }))

  // 获取对话消息
  Mock.mock(/\/api\/conversations\/\w+\/messages/, 'get', (options: { url: string }) => {
    const match = options.url.match(/\/conversations\/(\w+)\/messages/)
    if (!match) return { code: 404, message: '对话不存在' }
    const conversationId = match[1]
    return {
      code: 200,
      message: '获取对话消息成功',
      data: generateMessages(20, conversationId)
    }
  })

  // 发送消息
  Mock.mock(/\/api\/conversations\/\w+\/messages/, 'post', (options: { url: string; body: string }) => {
    const match = options.url.match(/\/conversations\/(\w+)\/messages/)
    if (!match) return { code: 404, message: '对话不存在' }
    const conversationId = match[1]
    const { content } = JSON.parse(options.body)

    return {
      code: 200,
      message: '发送消息成功',
      data: {
        id: Date.now().toString(),
        sender: {
          id: 'current',
          name: '当前用户',
          email: 'current@example.com',
          avatar: Random.image('100x100', '#4F46E5', 'Current'),
          role: {
            id: '1',
            name: '管理员',
            permissions: [],
            description: '系统管理员'
          },
          status: 'active',
          createdAt: new Date().toISOString()
        },
        content,
        timestamp: new Date().toISOString(),
        read: true,
        conversationId
      }
    }
  })

  // 标记消息已读
  Mock.mock(/\/api\/messages\/\w+\/read/, 'put', () => ({
    code: 200,
    message: '标记消息已读成功',
    data: null
  }))

  // 获取通知列表
  Mock.mock(/\/api\/notifications/, 'get', () => ({
    code: 200,
    message: '获取通知列表成功',
    data: generateNotifications(10)
  }))

  // 标记通知已读
  Mock.mock(/\/api\/notifications\/\w+\/read/, 'put', () => ({
    code: 200,
    message: '标记通知已读成功',
    data: null
  }))

  // 批量标记通知已读
  Mock.mock(/\/api\/notifications\/batch-read/, 'post', () => ({
    code: 200,
    message: '批量标记通知已读成功',
    data: null
  }))

  // 删除通知
  Mock.mock(/\/api\/notifications\/\w+/, 'delete', () => ({
    code: 200,
    message: '删除通知成功',
    data: null
  }))

  // 批量删除通知
  Mock.mock(/\/api\/notifications\/batch-delete/, 'post', () => ({
    code: 200,
    message: '批量删除通知成功',
    data: null
  }))
}

export default setupMessageMocks
