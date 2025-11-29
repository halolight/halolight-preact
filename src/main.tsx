import { render } from 'preact'
import './index.css'
import { App } from './app'

// 初始化 Mock 数据（开发环境）
import './mock'

const appElement = document.getElementById('app')
if (appElement) {
  render(<App />, appElement)
} else {
  console.error('未找到 #app 元素')
}
