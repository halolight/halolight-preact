/**
 * SEO/TDK 配置
 * 页面标题、描述、关键词配置
 */
export interface TDKConfig {
  title: string
  description: string
  keywords: string[]
}

export const tdkConfig: Record<string, TDKConfig> = {
  '/login': {
    title: '登录',
    description: '登录到管理后台',
    keywords: ['登录', '后台', '管理'],
  },
  '/register': {
    title: '注册',
    description: '注册新账户',
    keywords: ['注册', '账户', '用户'],
  },
  '/forgot-password': {
    title: '忘记密码',
    description: '重置账户密码',
    keywords: ['密码', '重置', '忘记'],
  },
  '/dashboard': {
    title: '仪表盘',
    description: '系统概览和数据统计',
    keywords: ['仪表盘', '统计', '概览'],
  },
  '/users': {
    title: '用户管理',
    description: '管理系统用户',
    keywords: ['用户', '管理', '权限'],
  },
  '/messages': {
    title: '消息中心',
    description: '系统消息管理',
    keywords: ['消息', '通知', '公告'],
  },
  '/files': {
    title: '文件管理',
    description: '文件上传和管理',
    keywords: ['文件', '上传', '管理'],
  },
  '/calendar': {
    title: '日历',
    description: '日程和事件管理',
    keywords: ['日历', '日程', '事件'],
  },
  '/analytics': {
    title: '数据分析',
    description: '系统数据分析',
    keywords: ['分析', '数据', '图表'],
  },
  '/security': {
    title: '安全审计',
    description: '系统安全监控',
    keywords: ['安全', '审计', '监控'],
  },
  '/settings': {
    title: '系统设置',
    description: '系统配置和管理',
    keywords: ['设置', '配置', '系统'],
  },
}