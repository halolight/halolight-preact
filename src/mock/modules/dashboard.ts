import Mock from 'mockjs'
import type {
  DashboardStats,
  VisitData,
  SalesData,
  ChartData,
  Product,
  Order,
  Activity
} from '../../types'

const { Random } = Mock

// 生成仪表盘统计数据
function generateDashboardStats(): DashboardStats {
  return {
    totalUsers: Random.integer(1000, 5000),
    userChange: Random.float(-20, 20, 2, 2),
    totalRevenue: Random.integer(50000, 200000),
    revenueChange: Random.float(-10, 30, 2, 2),
    totalOrders: Random.integer(100, 1000),
    orderChange: Random.float(-15, 25, 2, 2),
    conversionRate: Random.float(1, 10, 2, 2),
    conversionChange: Random.float(-5, 15, 2, 2)
  }
}

// 生成访问趋势数据（7天）
function generateVisitData(): VisitData[] {
  const data: VisitData[] = []
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toISOString().split('T')[0],
      visits: Random.integer(100, 1000),
      pageViews: Random.integer(200, 2000)
    })
  }

  return data
}

// 生成销售趋势数据（6个月）
function generateSalesData(): SalesData[] {
  const data: SalesData[] = []
  const today = new Date()

  for (let i = 5; i >= 0; i--) {
    const date = new Date(today)
    date.setMonth(date.getMonth() - i)

    data.push({
      month: date.toISOString().slice(0, 7),
      sales: Random.integer(10000, 50000),
      orders: Random.integer(50, 200)
    })
  }

  return data
}

// 生成热门产品数据
function generateProducts(): Product[] {
  const productNames = [
    '智能手机', '笔记本电脑', '平板电脑', '智能手表', '无线耳机',
    '智能音箱', '游戏手柄', '键盘鼠标套装', '显示器', '路由器'
  ]

  return Mock.mock({
    'list|8': [{
      'id|+1': 1,
      'name': () => Random.pick(productNames),
      'sales': () => Random.integer(100, 1000),
      'growth': () => Random.float(-20, 50, 2, 2)
    }]
  }).list
}

// 生成最近订单数据
function generateOrders(): Order[] {
  const statuses: Array<'pending' | 'processing' | 'completed' | 'cancelled'> = ['pending', 'processing', 'completed', 'cancelled']
  const customerNames = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']

  return Mock.mock({
    'list|10': [{
      'id|+1': 1,
      'customer': () => Random.pick(customerNames),
      'amount': () => Random.integer(100, 5000),
      'status': () => Random.pick(statuses),
      'date': '@datetime'
    }]
  }).list
}

// 生成用户活动数据
function generateActivities(): Activity[] {
  const actions = ['登录系统', '更新资料', '创建订单', '修改密码', '上传文件', '发送消息']
  const types: Array<'login' | 'update' | 'create' | 'delete'> = ['login', 'update', 'create', 'delete']
  const userNames = ['张三', '李四', '王五', '赵六', '钱七', '孙八']

  return Mock.mock({
    'list|15': [{
      'id|+1': 1,
      'user': () => Random.pick(userNames),
      'action': () => Random.pick(actions),
      'timestamp': '@datetime',
      'type': () => Random.pick(types)
    }]
  }).list
}

// 生成流量来源数据
function generateTrafficSources(): ChartData[] {
  const sources = [
    { name: '搜索引擎', value: 45 },
    { name: '直接访问', value: 30 },
    { name: '社交媒体', value: 15 },
    { name: '邮件营销', value: 6 },
    { name: '其他', value: 4 }
  ]

  return sources.map(source => ({
    name: source.name,
    value: Random.integer(source.value - 5, source.value + 5)
  }))
}

// 生成地区分布数据
function generateRegions(): ChartData[] {
  const regions = [
    { name: '北京', value: 25 },
    { name: '上海', value: 20 },
    { name: '广州', value: 15 },
    { name: '深圳', value: 12 },
    { name: '杭州', value: 8 },
    { name: '成都', value: 6 },
    { name: '其他', value: 14 }
  ]

  return regions.map(region => ({
    name: region.name,
    value: Random.integer(region.value - 2, region.value + 2)
  }))
}

// 生成设备类型数据
function generateDevices(): ChartData[] {
  const devices = [
    { name: '桌面端', value: 60 },
    { name: '移动端', value: 35 },
    { name: '平板端', value: 5 }
  ]

  return devices.map(device => ({
    name: device.name,
    value: Random.integer(device.value - 5, device.value + 5)
  }))
}

// 生成浏览器类型数据
function generateBrowsers(): ChartData[] {
  const browsers = [
    { name: 'Chrome', value: 65 },
    { name: 'Safari', value: 15 },
    { name: 'Firefox', value: 10 },
    { name: 'Edge', value: 6 },
    { name: '其他', value: 4 }
  ]

  return browsers.map(browser => ({
    name: browser.name,
    value: Random.integer(browser.value - 5, browser.value + 5)
  }))
}

// 生成实时数据
function generateRealtimeData() {
  return {
    onlineUsers: Random.integer(50, 200),
    pageViews: Random.integer(100, 500),
    activeSessions: Random.integer(30, 150),
    bounceRate: Random.float(20, 60, 2, 2)
  }
}

// 生成性能指标
function generatePerformanceData() {
  return {
    avgLoadTime: Random.float(0.5, 3, 2, 2),
    avgResponseTime: Random.float(100, 500, 0, 0),
    errorRate: Random.float(0.1, 2, 2, 2),
    uptime: Random.float(99, 100, 2, 2)
  }
}

// Mock 接口定义
export function setupDashboardMocks() {
  // 获取仪表盘统计数据
  Mock.mock(/\/api\/dashboard\/summary/, 'get', () => ({
    code: 200,
    message: '获取仪表盘统计数据成功',
    data: generateDashboardStats()
  }))

  // 获取访问趋势数据
  Mock.mock(/\/api\/dashboard\/visits/, 'get', () => ({
    code: 200,
    message: '获取访问趋势数据成功',
    data: generateVisitData()
  }))

  // 获取销售趋势数据
  Mock.mock(/\/api\/dashboard\/sales/, 'get', () => ({
    code: 200,
    message: '获取销售趋势数据成功',
    data: generateSalesData()
  }))

  // 获取产品数据
  Mock.mock(/\/api\/dashboard\/products/, 'get', () => ({
    code: 200,
    message: '获取产品数据成功',
    data: generateProducts()
  }))

  // 获取订单数据
  Mock.mock(/\/api\/dashboard\/orders/, 'get', () => ({
    code: 200,
    message: '获取订单数据成功',
    data: generateOrders()
  }))

  // 获取用户活动数据
  Mock.mock(/\/api\/dashboard\/activities/, 'get', () => ({
    code: 200,
    message: '获取用户活动数据成功',
    data: generateActivities()
  }))

  // 获取流量来源数据
  Mock.mock(/\/api\/dashboard\/traffic-sources/, 'get', () => ({
    code: 200,
    message: '获取流量来源数据成功',
    data: generateTrafficSources()
  }))

  // 获取地区分布数据
  Mock.mock(/\/api\/dashboard\/regions/, 'get', () => ({
    code: 200,
    message: '获取地区分布数据成功',
    data: generateRegions()
  }))

  // 获取设备类型数据
  Mock.mock(/\/api\/dashboard\/devices/, 'get', () => ({
    code: 200,
    message: '获取设备类型数据成功',
    data: generateDevices()
  }))

  // 获取浏览器类型数据
  Mock.mock(/\/api\/dashboard\/browsers/, 'get', () => ({
    code: 200,
    message: '获取浏览器类型数据成功',
    data: generateBrowsers()
  }))

  // 获取实时数据
  Mock.mock(/\/api\/dashboard\/realtime/, 'get', () => ({
    code: 200,
    message: '获取实时数据成功',
    data: generateRealtimeData()
  }))

  // 获取性能指标
  Mock.mock(/\/api\/dashboard\/performance/, 'get', () => ({
    code: 200,
    message: '获取性能指标成功',
    data: generatePerformanceData()
  }))
}

export default setupDashboardMocks
